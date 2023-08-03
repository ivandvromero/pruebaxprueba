import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import {
  CustomException,
  EntityDoesNotExistException,
  InvalidPayloadException,
  UnauthorizedException,
} from '../custom-errors/custom-exception';
@Catch(CustomException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: CustomException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let statusCode: number;
    switch (true) {
      case exception instanceof InvalidPayloadException:
        statusCode = 400;
        break;
      case exception instanceof UnauthorizedException:
        statusCode = 401;
        break;
      case exception instanceof EntityDoesNotExistException:
        statusCode = 404;
        break;
      default:
        statusCode = 500;
        break;
    }
    response.status(statusCode).json(exception);
  }
}
