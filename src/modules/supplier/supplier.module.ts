import { Module } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierEntity } from './entities/supplier.entity';
import { SupplierOTPEntity } from './entities/otp.entity';
import { S3Service } from '../s3/s3.service';
import { S3Module } from '../s3/s3.module';
import { CategoryModule } from '../category/category.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports:[
    TypeOrmModule.forFeature([SupplierEntity,SupplierOTPEntity]),
    CategoryModule,
    S3Module
  ],
  controllers: [SupplierController],
  providers: [SupplierService,JwtService],
})
export class SupplierModule {}
