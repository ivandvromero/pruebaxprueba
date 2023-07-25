import { mapSystemErrors } from '@dale/shared-nestjs/utils/map-system-errors';
import {
  CustomException,
  DefaultErrorException,
} from '@dale/shared-nestjs/custom-errors/custom-exception';

import { Logger } from '@dale/logger-nestjs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ErrorCustomizer {
  constructor(private logger: Logger) {}

  customizeError = (
    err: any,
    maskedValue?: string,
    trackingId?: string,
  ): CustomException => {
    let logMessage;

    if (err instanceof CustomException) {
      logMessage = maskedValue
        ? `${err.error.message} for ${maskedValue}`
        : err.error.message;

      this.logger.error(logMessage, null, trackingId);
      return err;
    }

    const errorResponse = new DefaultErrorException(mapSystemErrors());
    logMessage = maskedValue
      ? `${errorResponse.error.message} for ${maskedValue}`
      : errorResponse.error.message;
    this.logger.error(logMessage, err.message, trackingId);

    return errorResponse;
  };
}
