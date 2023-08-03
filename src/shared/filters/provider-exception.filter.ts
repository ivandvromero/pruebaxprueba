import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { ProviderException } from '../custom-errors/provider-exception';

@Catch(ProviderException)
export class ProviderExceptionFilter implements ExceptionFilter {
  catch(exception: ProviderException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(exception.statusCode).json(exception.error);
  }
}
