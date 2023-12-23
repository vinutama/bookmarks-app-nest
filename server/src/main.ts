import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // This is for activate pipes class-validator on global
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(3111);
}
bootstrap();
