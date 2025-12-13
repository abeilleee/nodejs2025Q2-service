import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
import { loadSwaggerDocument } from './utils/loadSwaggerDocument';
import { LoggingService } from './logging/logging.service';

async function bootstrap() {
  const logger = new LoggingService();
  const app = await NestFactory.create(AppModule, { logger });

  dotenv.config();

  process.on('unhandledRejection', (error: unknown) => {
    const errorMsg = error instanceof Error ? error : new Error(String(error));
    logger.error('Unhandled Rejection', errorMsg);
  });

  process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception', error);
    setTimeout(() => process.exit(1), 1000);
  });

  const document = await loadSwaggerDocument();

  app.useGlobalPipes(new ValidationPipe({}));
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT);

  logger.verbose(`Application started on port ${process.env.port}`);
}

bootstrap();
