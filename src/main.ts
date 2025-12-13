import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
import { loadSwaggerDocument } from './utils/loadSwaggerDocument';
import { LoggingService } from './logging/logging.service';

async function bootstrap() {
  const logger = new LoggingService();
  await logger.initialize();
  const app = await NestFactory.create(AppModule, { logger });
  const document = await loadSwaggerDocument();

  app.useGlobalPipes(new ValidationPipe({}));
  dotenv.config();
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT);
}

bootstrap();
