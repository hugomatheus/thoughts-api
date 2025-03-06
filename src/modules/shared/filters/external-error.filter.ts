import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ExternalError } from '../../../core/shared/domain/errors/external.error';
import { Response } from 'express';

@Catch(ExternalError)
export class ExternalErrorFilter implements ExceptionFilter {
  catch(exception: ExternalError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();

    response.status(exception.status).json({
      statusCode: exception.status,
      error: exception.error,
      message: exception.message,
    });
  }
}
