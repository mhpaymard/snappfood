import { BadRequestException, ConflictException, Inject, Injectable, Scope, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SupplierEntity } from './entities/supplier.entity';
import { Repository } from 'typeorm';
import { SupplementaryInformationDto, SupplierSignupDto, UploadDocumentsDto } from './dto/supplier.dto';
import { AuthMessage, BadRequestMessage, ConflictMessages, PublicMessages } from 'src/common/enums/messages.enum';
import { CategoryService } from '../category/category.service';
import { randomInt } from 'crypto';
import { SupplierOTPEntity } from './entities/otp.entity';
import { CheckOtpDto } from '../auth/dto/auth.dto';
import { TokensPayload } from '../auth/type/payload.type';
import { JwtService } from '@nestjs/jwt';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { SupplierStatus } from './enum/supplier-status.enum';
import { SupplementaryDocumentType } from './type/supplementary-document.type';
import { S3Service } from '../s3/s3.service';

@Injectable({scope:Scope.REQUEST})
export class SupplierService {
  constructor(
    @InjectRepository(SupplierEntity) private supplierRepository:Repository<SupplierEntity>,
    @InjectRepository(SupplierOTPEntity) private supplierOtpRepository:Repository<SupplierOTPEntity>,
    private categoryService:CategoryService,
    private jwtService:JwtService,
    @Inject(REQUEST) private request:Request,
    private s3Service:S3Service
  ){}

  async signup(signupDto:SupplierSignupDto){
    let {category_id,invite_code,city,manager_family,manager_name,phone,store_name} = signupDto;
    const supplier = await this.supplierRepository.findOneBy({phone});
    if(supplier) throw new ConflictException(ConflictMessages.SupplierAccountPhone)
    const category = await this.categoryService.findOneById(+category_id);
    let agent:SupplierEntity = null;
    if(invite_code){
      agent = await this.supplierRepository.findOneBy({invite_code});
    }
    const mobileNumber = parseInt(phone)
    let account = this.supplierRepository.create({
      manager_name,
      manager_family,
      city,
      store_name,
      category_id:category.id,
      phone,
      agent_id:agent?.id ?? null,
      invite_code:mobileNumber.toString(32).toUpperCase()
    })
    account = await this.supplierRepository.save(account);
    const code = await this.makeOtpForSupplier(account);
    return {
      message:PublicMessages.SendOtp,
      code
    }
  }
  async checkOtp(otpDto:CheckOtpDto){
    const {phone,code} = otpDto;
    const supplier = await this.supplierRepository.findOne(
      {
        where:{phone},
        relations:{otp:true}
      }
    );
    if(!supplier || !supplier?.otp) throw new UnauthorizedException(AuthMessage.LoginAgain);
    if(supplier?.otp?.code !== code) throw new UnauthorizedException(AuthMessage.WrongOtpCode);
    if(supplier?.otp.expires_in < new Date()) throw new UnauthorizedException(AuthMessage.ExpiredOtpCode);
    if(!supplier?.mobile_verify) await this.supplierRepository.update({id:supplier.id},{mobile_verify:true});
    await this.supplierOtpRepository.update({id:supplier.otp_id},{expires_in:new Date()});
    const {accessToken,refreshToken} = this.makeTokenForSupplier({
      id:supplier.id,
      phone
    })
    return {
      message: PublicMessages.LoggedIn,
      refreshToken,
      accessToken
    }
  }
  async makeOtpForSupplier(supplier:SupplierEntity):Promise<string>{
    const code = randomInt(10000,99999).toString();
    const expires_In = new Date(Date.now() + 1000 * 60 * 2)  //expires in 2 minutes
    let otp = await this.supplierOtpRepository.findOneBy({supplier_id:supplier.id});
    if(otp){
      if(otp.expires_in > new Date()) throw new BadRequestException(BadRequestMessage.OtpNotExpired)
      otp.code = code;
      otp.expires_in = expires_In;
      otp.supplier_id = supplier?.id;
    }else{
      otp = this.supplierOtpRepository.create({code,expires_in:expires_In,supplier_id:supplier?.id});
    }
    otp = await this.supplierOtpRepository.save(otp);
    await this.supplierRepository.update(
      {
        id:supplier.id
      },
      {
        otp_id:otp?.id
      }
    );
    return code;
  }

  async saveSupplementaryInformation(infoDto:SupplementaryInformationDto){
    const {id} = this.request.user;
    const {email,national_code} = infoDto;
    let supplier = await this.supplierRepository.findOneBy({national_code});
    if(supplier && supplier.id!==id) throw new ConflictException(ConflictMessages.NationalCode)
    supplier = await this.supplierRepository.findOneBy({email});
    if(supplier && supplier.id!==id) throw new ConflictException(ConflictMessages.Email)
    await this.supplierRepository.update({id},{
      national_code,
      email,
      status:SupplierStatus.SupplementaryInformation
    })
    return {
      message:PublicMessages.Updated
    }
  }

  async uploadDocuments(files:SupplementaryDocumentType){
    const {contract,personal_image} = files;
    const {id} = this.request.user;
    const supplier = await this.supplierRepository.findOneBy({id});

    const personal_image_result = await this.s3Service.uploadFile(personal_image[0],"personal_image");

    const contract_results = [];
    for await(const image of contract){
      const uploadedContract = await this.s3Service.uploadFile(image,"contract");
      if(uploadedContract){
        contract_results.push(uploadedContract.Location);
      }
    }

    if(personal_image_result) supplier.personal_image = personal_image_result.Location;
    supplier.documents = contract_results;

    supplier.status = SupplierStatus.UploadedDocument;
    await this.supplierRepository.save(supplier);
    return {
      message:PublicMessages.Uploaded
    }
  }
  makeTokenForSupplier(payload: TokensPayload){
    const accessToken = this.jwtService.sign(payload,
      {
        secret:process.env.ACCESS_TOKEN_SECRET,
        expiresIn:"3d"
      }
    );
    const refreshToken = this.jwtService.sign(payload,
      {
        secret:process.env.REFRESH_TOKEN_SECRET,
        expiresIn:"7d"
      }
    );
    return {accessToken,refreshToken}
  }
  async validateAccessToken(token:string){
    try{
      const payload = this.jwtService.verify<TokensPayload>(token,{
        secret:process.env.ACCESS_TOKEN_SECRET
      });
      if(typeof payload === "object" && payload?.id){
        const supplier = await this.supplierRepository.findOneBy({id:payload?.id});
        if(!supplier) throw new UnauthorizedException(AuthMessage.LoginRequired);
        return supplier;
      }
      throw new UnauthorizedException(AuthMessage.LoginRequired);
    }catch(error){
      throw new UnauthorizedException(AuthMessage.LoginRequired);
    }
  }
}
