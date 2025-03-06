import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { GLOBAL_API_PREFIX } from './config/contants/contants';
import { useContainer } from 'class-validator';
import { ExternalErrorFilter } from './modules/shared/filters/external-error.filter';
import { BadRequestErrorFilter } from './modules/shared/filters/bad-request-error.filter';
import { NotFoundErrorFilter } from './modules/shared/filters/not-found-error.filter';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './config/logger/winston.config';

async function bootstrap() {
  const logger = WinstonModule.createLogger(winstonConfig);
  const app = await NestFactory.create(AppModule, { logger });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: false,
      validationError: { target: false },
      whitelist: true,
    }),
  );
  app.setGlobalPrefix(GLOBAL_API_PREFIX);
  app.enableCors();
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalFilters(
    new ExternalErrorFilter(),
    new BadRequestErrorFilter(),
    new NotFoundErrorFilter(),
  );
  await app.listen(process.env.APP_PORT ?? 3000, () => {
    Logger.log(
      `Listening at http://localhost:${process.env.APP_PORT}/${GLOBAL_API_PREFIX}`,
    );
  });
}
bootstrap();
