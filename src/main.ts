import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
import { loadSwaggerDocument } from './utils/loadSwaggerDocument';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const document = await loadSwaggerDocument();

  app.useGlobalPipes(new ValidationPipe({}));
  dotenv.config();
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT);
}

bootstrap();
