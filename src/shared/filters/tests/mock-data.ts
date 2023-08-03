import { HttpStatus } from '@nestjs/common';
import {
  ErrorCodes,
  ErrorMessage,
  ErrorObjectType,
} from '../../constants/system-errors';
import { CustomException } from '../../custom-errors/custom-exception';
export const mockTrackingId = 'mock-id';
export const mockMessage404 = 'Cannot POST test';
export const mockError = new Error('Test error');
export const mockMessage = ErrorMessage.DEFAULT_REASON;
export const mockError404 = {
  message: mockMessage404,
  status: 404,
};
export const mockError400 = {
  response: {
    message: [
      '{"code": ' + ErrorCodes.DEFAULT_CODE + ', "message":"test_error"}',
    ],
  },
};
export const mockErrorBadRequest400: ErrorObjectType = {
  code: ErrorCodes.DEFAULT_CODE,
  message: 'test_error',
};
export const mockErrorsBadRequest400: ErrorObjectType = {
  code: ErrorCodes.VALIDATION_ERROR_CODE,
  message: 'invalid_userId',
};

export const mockErrorResponseBadRequest400 = {
  code: ErrorCodes.DEFAULT_CODE,
  message: 'test_error',
};

export const mockDefaultErrors: ErrorObjectType = {
  code: ErrorCodes.DEFAULT_CODE,
  message: ErrorMessage.DEFAULT_REASON,
};
export const mockErrorDefaultResponse = {
  code: ErrorCodes.DEFAULT_CODE,
  message: ErrorMessage.DEFAULT_REASON,
};
export const mockDefaultException = new CustomException(mockDefaultErrors);
export const mockErrors404: ErrorObjectType = {
  code: ErrorCodes.ENDPOINT_DOES_NOT_EXIST_INTERNAL_CODE,
  message: ErrorMessage.ENDPOINT_DOES_NOT_EXIST_INTERNAL_REASON,
};
export const mockErrorsBadRequest: ErrorObjectType[] = [
  {
    code: ErrorCodes.VALIDATION_ERROR_CODE,
    message: 'invalid_userId',
  },
];
export const mockErrorResponseBadRequest = {
  message: ErrorMessage.INVALID_PAYLOAD_ERROR,
  statusCode: HttpStatus.BAD_REQUEST,
  mockErrorsBadRequest,
};

export const mockUnauthorizedErrorMessage = 'Unauthorized';
export const mockUnauthorizedError401 = {
  message: ErrorMessage.UNAUTHORIZED_REASON,
  requestId: 'test-req-id',
  statusCode: 401,
  code: 'InvalidClientTokenId',
};
export const mockUnauthorizedErrors = [
  {
    source: ErrorMessage.SYSTEM_SOURCE,
    code: ErrorCodes.UNAUTHORIZED_CODE,
    reason: ErrorMessage.UNAUTHORIZED_REASON,
    details: ErrorMessage.UNAUTHORIZED_DETAIL,
  },
];
