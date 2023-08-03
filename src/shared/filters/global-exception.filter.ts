import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { Logger } from '@dale/logger-nestjs';
import { CustomException } from '../../shared/custom-errors/custom-exception';
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private logger: Logger) {}
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let errorInstance: any;
    if (exception instanceof CustomException) {
      errorInstance = exception.error;
    } else {
      errorInstance = exception.response;
    }
    const trace = exception.message;
    this.logger.error(errorInstance, trace);
    if (response.status) {
      response.status(400).json(errorInstance);
    }
    return exception;
  }
}
