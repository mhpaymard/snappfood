import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseInterceptors, UploadedFiles, ParseFilePipe } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplementaryInformationDto, SupplierSignupDto, UploadDocumentsDto } from './dto/supplier.dto';
import { CheckOtpDto } from '../auth/dto/auth.dto';
import { SupplierAuth } from 'src/common/decorators/auth.decorator';
import { ApiConsumes } from '@nestjs/swagger';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { UploadFileFieldsS3 } from 'src/common/interceptors/upload-file.interceptor';
import { SupplementaryDocumentType } from './type/supplementary-document.type';

@Controller('supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post("/signup")
  @ApiConsumes(SwaggerConsumes.UrlEncoded,SwaggerConsumes.Json)
  sendOtp(@Body() supplierDto: SupplierSignupDto) {
    return this.supplierService.signup(supplierDto);
  }

  @Post("/check-otp")
  @ApiConsumes(SwaggerConsumes.UrlEncoded,SwaggerConsumes.Json)
  checkOtp(@Body() otpDto:CheckOtpDto) {
    return this.supplierService.checkOtp(otpDto);
  }

  @Post("/supplementary-information")
  @ApiConsumes(SwaggerConsumes.UrlEncoded,SwaggerConsumes.Json)
  @SupplierAuth()
  supplementaryInformation(@Body() infoDto:SupplementaryInformationDto) {
    return this.supplierService.saveSupplementaryInformation(infoDto);
  }

  @Put("/upload-document")
  @ApiConsumes(SwaggerConsumes.MultipartData)
  @SupplierAuth()
  @UseInterceptors(UploadFileFieldsS3([
    {name:"contract",maxCount:3},
    {name:"personal_image",maxCount:1}
  ]))
  uploadDocument(@Body() uploadDocumentsDto:UploadDocumentsDto,@UploadedFiles() files: SupplementaryDocumentType) {
    return this.supplierService.uploadDocuments(files);
  }
}
