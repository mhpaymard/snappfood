import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { CheckOtpDto, SendOtpDto } from './dto/auth.dto';
import { randomInt } from 'crypto';
import { TokensPayload } from './type/payload.type';
import { JwtService } from '@nestjs/jwt';
import { UserOTPEntity } from '../user/entity/otp.entity';
import { UserEntity } from '../user/entity/user.entity';
import { AuthMessage, PublicMessages } from 'src/common/enums/messages.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private userRepository:Repository<UserEntity>,
    @InjectRepository(UserOTPEntity) private otpRepository:Repository<UserOTPEntity>,
    private jwtService:JwtService
  ){}
  async sendOtp(otpDto:SendOtpDto){
    const {phone} = otpDto;
    let user = await this.userRepository.findOneBy({phone});
    if(!user){
      user = this.userRepository.create({
        phone
      });
      user = await this.userRepository.save(user);
    }
    const code = await this.makeOtpForUser(user);
    return {
      message: PublicMessages.SendOtp,
      code
    }

  }
  async checkOtp(otpDto:CheckOtpDto){
    const {phone,code} = otpDto;
    const user = await this.userRepository.findOne(
      {
        where:{phone},
        relations:{otp:true}
      }
    );
    if(!user || !user?.otp) throw new UnauthorizedException(AuthMessage.LoginAgain);
    if(user?.otp?.code !== code) throw new UnauthorizedException(AuthMessage.WrongOtpCode);
    if(user?.otp.expires_in < new Date()) throw new UnauthorizedException(AuthMessage.ExpiredOtpCode);
    if(!user?.mobile_verify) await this.userRepository.update({id:user.id},{mobile_verify:true});
    await this.otpRepository.update({id:user.otp_id},{expires_in:new Date()});
    const {accessToken,refreshToken} = this.makeTokenForUser({
      id:user.id,
      phone
    })
    return {
      message: PublicMessages.LoggedIn,
      refreshToken,
      accessToken
    }
  }
  async makeOtpForUser(user:UserEntity):Promise<string>{
    const code = randomInt(10000,99999).toString();
    const expires_In = new Date(Date.now() + 1000 * 60 * 2)  //expires in 2 minutes
    let otp = await this.otpRepository.findOneBy({user_id:user.id});
    if(otp){
      otp.code = code;
      otp.expires_in = expires_In;
      otp.user_id = user?.id;
    }else{
      otp = this.otpRepository.create({code,expires_in:expires_In,user_id:user?.id});
    }
    otp = await this.otpRepository.save(otp);
    await this.userRepository.update(
      {
        id:user.id
      },
      {
        otp_id:otp?.id
      }
    );
    return code;
  }
  makeTokenForUser(payload: TokensPayload){
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
        const user = await this.userRepository.findOneBy({id:payload?.id});
        if(!user) throw new UnauthorizedException(AuthMessage.LoginRequired);
        return user;
      }
      throw new UnauthorizedException(AuthMessage.LoginRequired);
    }catch(error){
      throw new UnauthorizedException(AuthMessage.LoginRequired);
    }
  }
}
