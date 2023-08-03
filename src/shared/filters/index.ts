import { GlobalExceptionFilter } from './global-exception.filter';
import { NotFoundExceptionFilter } from './not-found-exception.filter';
import { BadRequestExceptionFilter } from './bad-request-exception.filter';
import { CustomExceptionFilter } from './custom-exception.filter';
import { UnauthorizedExceptionFilter } from './unauthorized-exception.filter';
import { APP_FILTER } from '@nestjs/core';
import { ProviderExceptionFilter } from './provider-exception.filter';

export {
  GlobalExceptionFilter,
  NotFoundExceptionFilter,
  BadRequestExceptionFilter,
  CustomExceptionFilter,
  UnauthorizedExceptionFilter,
  ProviderExceptionFilter,
};

// Order of this array matters, do not change it.
export const ALL_EXCEPTION_FILTERS_FOR_PROVIDER = [
  {
    provide: APP_FILTER,
    useClass: GlobalExceptionFilter,
  },
  {
    provide: APP_FILTER,
    useClass: CustomExceptionFilter,
  },
  {
    provide: APP_FILTER,
    useClass: ProviderExceptionFilter,
  },
  {
    provide: APP_FILTER,
    useClass: BadRequestExceptionFilter,
  },
  {
    provide: APP_FILTER,
    useClass: NotFoundExceptionFilter,
  },
  {
    provide: APP_FILTER,
    useClass: UnauthorizedExceptionFilter,
  },
];
