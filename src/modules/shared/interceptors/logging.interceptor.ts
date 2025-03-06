/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Request } from 'express';

interface RequestInterface extends Request {
  user?: { id: number };
}

interface ErrorInterface extends Error {
  status?: number;
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    let request: RequestInterface;
    if (context.getType() === 'http') {
      const ctx = context.switchToHttp();
      request = ctx.getRequest<RequestInterface>();
    }
    return next.handle().pipe(
      tap({
        next: () => {
          if (context.getType() === 'http') {
            this.logger.log({
              userId: request?.user?.id || null,
              ipAddress: request?.ip,
              requestBody: request?.body,
              url: request?.url,
              method: request?.method,
              userAgent: request?.headers['user-agent'],
            });
          }
        },
      }),
      catchError((error: ErrorInterface) => {
        this.logger.error({
          userId: request?.user?.id || null,
          ipAddress: request?.ip,
          requestBody: request?.body,
          url: request?.url,
          method: request?.method,
          userAgent: request?.headers['user-agent'],
          status: error.status ?? 500,
          message: error.message ?? 'error',
        });
        return throwError(() => error);
      }),
    );
  }
}
