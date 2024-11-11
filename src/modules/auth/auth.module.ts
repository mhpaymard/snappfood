import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '../user/entity/user.entity';
import { UserOTPEntity } from '../user/entity/otp.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([UserEntity,UserOTPEntity])
  ],
  controllers: [AuthController],
  providers: [AuthService,JwtService,ConfigService],
  exports:[AuthService,JwtService,TypeOrmModule]
})
export class AuthModule {}
