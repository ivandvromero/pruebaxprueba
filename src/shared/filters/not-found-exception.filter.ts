import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { Logger } from '@dale/logger-nestjs';
import { mapSystemErrors } from '../utils/map-system-errors';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  constructor(private logger: Logger) {}
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const trackingId = request.body?.trackingId ?? request.query?.trackingId;

    const statusCode: number = HttpStatus.NOT_FOUND;
    const message: string = exception.message;
    const mappedErrors = mapSystemErrors(exception);
    const trace = exception.message;

    const errorResponse = { errors: mappedErrors };
    this.logger.error(message, trace, trackingId);

    response.status(statusCode).json(errorResponse);
  }
}
