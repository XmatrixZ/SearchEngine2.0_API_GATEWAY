import {
  CallHandler,
  ExecutionContext,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    const { ip, method, path: url } = request;
    const userId = 1; // TODO: FIGURE OUT HOW TO GET USER ID
    const RoutHandlerTimeInitial = Date.now();
    const userAgent = request.get('user-agent') || '';

    this.logger.log(
      `${method} ${url} ${userAgent} ${ip}: ${context.getClass().name} ${context.getHandler().name} invoked...`,
    );
    this.logger.debug('userId:', userId);
    return next.handle().pipe(
      tap(res => {
        //TODO: encrypt the response before sending it
        const response = context.switchToHttp().getResponse();
        const { statusCode } = response;
        const contentLength = response.get('content-length');

        this.logger.log(
          `${method} ${url} ${statusCode} ${contentLength} - ${userAgent} ${ip}: ${Date.now() - RoutHandlerTimeInitial} ms`,
        );
        this.logger.debug('Response:', res);
      }),
      catchError(err => {
        this.logger.error(err);
        return throwError(() => err);
      }),
    );
  }
}
