import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Logger } from '@dale/logger-nestjs';
import { ErrorMessage } from '../constants/system-errors';
@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  constructor(private logger: Logger) {}
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const trackingId = request.body?.trackingId ?? request.query?.trackingId;
    const statusCode: number = HttpStatus.BAD_REQUEST;
    const message: string = ErrorMessage.INVALID_PAYLOAD_ERROR;
    const validationErrorArgument: string[] =
      typeof exception.response?.message === 'string'
        ? [exception.response.message]
        : exception.response.message;
    const trace = exception.response?.message;
    this.logger.error(message, trace, trackingId);
    response.status(statusCode).json(validationErrorArgument);
  }
}
