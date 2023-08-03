import { mapSystemErrors } from '../shared/utils/map-system-errors';

import {
  CustomException,
  DefaultErrorException,
  EntityDoesNotExistException,
  InvalidPayloadException,
  UnauthorizedException,
} from '../shared/custom-errors/custom-exception';

import { mapAccountProviderErrors } from './map-account-provider-errors';
import { Logger } from '@dale/logger-nestjs';
import { ErrorObjectType } from '../shared/constants/system-errors';
import { Injectable } from '@nestjs/common';

type AccountExceptions = {
  400: InvalidPayloadException;
  401: UnauthorizedException;
  404: EntityDoesNotExistException;
  500: DefaultErrorException;
  default: DefaultErrorException;
};

@Injectable()
export class ErrorCustomizer {
  constructor(private logger: Logger) {}

  customizeError = (
    err: any,
    maskedValue?: string,
    trackingId?: string,
  ): CustomException => {
    let logMessage;
    let trace = err.message;
    let errorResponse: CustomException;

    const errors: ErrorObjectType = mapAccountProviderErrors(err);
    const exceptions: AccountExceptions = {
      400: new InvalidPayloadException(),
      401: new UnauthorizedException(),
      404: new EntityDoesNotExistException(),
      500: new DefaultErrorException(errors),
      default: new DefaultErrorException(mapSystemErrors()),
    };

    /** For common error status codes, there is a mapping to specific types of exceptions in the "exceptions" object.
     * If an error status code other than the defined one is encountered, a default exception is returned
     */
    if (
      Object.keys(exceptions)
        .map((key) => parseInt(key))
        .includes(err.response?.status)
    ) {
      errorResponse = exceptions[err.response?.status];
      trace = err.response?.data;
    } else {
      errorResponse = exceptions.default;
    }

    logMessage = maskedValue
      ? `${err.message} for ${maskedValue}`
      : err.message;

    if (err.response?.status) this.logger.debug(logMessage, trackingId, err);
    this.logger.error(logMessage, trace, trackingId);
    return errorResponse;
  };
}
