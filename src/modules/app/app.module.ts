import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { TypeOrmConfig } from 'src/config/typeorm.config';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:join(process.cwd(),".env"),
      isGlobal:true
    }),
    TypeOrmModule.forRoot(TypeOrmConfig()),
    CategoryModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
