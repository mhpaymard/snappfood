import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { S3Module } from '../s3/s3.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([CategoryEntity]),
    S3Module
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
