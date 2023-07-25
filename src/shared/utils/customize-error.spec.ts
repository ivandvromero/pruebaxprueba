import {
  CustomException,
  GlobalErrorObjectType,
} from '@dale/shared-nestjs/custom-errors/custom-exception';
import { DEFAULT_ERROR } from '@dale/shared-nestjs/constants/errors';
import { SYSTEM_SOURCE } from '@dale/shared-nestjs/constants/error-sources';
import { HttpStatus } from '@nestjs/common';
import {
  DEFAULT_DETAIL,
  DEFAULT_REASON,
  ErrorCodes,
  ErrorObjectType,
} from '@dale/shared-nestjs/constants/system-errors';

import { Logger } from '@dale/logger-nestjs';
import { ErrorCustomizer } from './customize.error';
export const mockMaskedUserId = 'mock-masked-value-for-user-id';
export const mockTrackingId = 'mock-id';
export const mockExceptionError: GlobalErrorObjectType = {
  statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  message: 'test-error',
  errors: [
    {
      code: ErrorCodes.DEFAULT_CODE,
      reason: DEFAULT_REASON,
      details: DEFAULT_DETAIL,
      source: SYSTEM_SOURCE,
    },
  ],
};
export const mockException = new CustomException(mockExceptionError);

describe('customizeError function', () => {
  let mockErrorLogger;
  let customizeError;

  beforeEach(() => {
    const logger = new Logger({ context: __filename });
    mockErrorLogger = logger.error = jest.fn();

    const customizer = new ErrorCustomizer(logger);
    customizeError = customizer.customizeError;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should return custom exceptions and log default errors', () => {
    const mockError = new Error('test-error');
    const err: ErrorObjectType[] = [
      {
        code: ErrorCodes.DEFAULT_CODE,
        reason: DEFAULT_REASON,
        details: DEFAULT_DETAIL,
        source: SYSTEM_SOURCE,
      },
    ];
    const expectedErrorObject: GlobalErrorObjectType = {
      message: DEFAULT_ERROR,
      statusCode: 500,
      errors: err,
    };

    const receivedResponse = customizeError(mockError);
    expect(receivedResponse).toBeInstanceOf(CustomException);
    expect(receivedResponse.error).toEqual(expectedErrorObject);
    expect(mockErrorLogger).toHaveBeenCalledTimes(1);
    expect(mockErrorLogger).toHaveBeenCalledWith(
      DEFAULT_ERROR,
      'test-error',
      undefined, // since no trackingId passed
    );
  });
  it('should handle CustomException errors thrown from service with masked value', () => {
    const receivedResponse = customizeError(
      mockException,
      mockMaskedUserId,
      mockTrackingId,
    );

    expect(receivedResponse.error).toEqual(mockExceptionError);
    expect(receivedResponse).toBeInstanceOf(CustomException);
    expect(mockErrorLogger).toHaveBeenCalledWith(
      `test-error for ${mockMaskedUserId}`,
      null,
      mockTrackingId,
    );
  });
  it('should handle CustomException errors thrown from service without masked value', () => {
    const receivedResponse = customizeError(
      mockException,
      null,
      mockTrackingId,
    );

    expect(receivedResponse.error).toEqual(mockExceptionError);
    expect(receivedResponse).toBeInstanceOf(CustomException);
    expect(mockErrorLogger).toHaveBeenCalledWith(
      'test-error',
      null,
      mockTrackingId,
    );
  });
});
