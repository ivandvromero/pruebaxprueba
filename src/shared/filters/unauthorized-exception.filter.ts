import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Logger } from '@dale/logger-nestjs';
import { mapSystemErrors } from '../utils/map-system-errors';
import { ErrorMessage } from '../constants/system-errors';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  constructor(private logger: Logger) {}
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const trackingId = request.body?.trackingId ?? request.query?.trackingId;

    const trace = exception.response?.message;
    const error = exception.error ?? exception;
    const message = ErrorMessage.UNAUTHORIZED_REASON;
    const errors = mapSystemErrors(error);
    const statusCode = HttpStatus.UNAUTHORIZED;
    this.logger.error(message, trace, trackingId);
    response.status(statusCode).json(errors);
  }
}
