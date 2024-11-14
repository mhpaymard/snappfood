import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { SwaggerConfigInit } from './config/swagger.config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  SwaggerConfigInit(app);
  const PORT = process.env.PORT;
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(PORT,()=>{
    console.log(`Server Is Running On Port ${PORT}`);
    console.log(`>> http://localhost:${PORT}/swagger`);
  });
}
bootstrap();
