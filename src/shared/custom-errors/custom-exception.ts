import {
  ErrorCodes,
  ErrorMessage,
  ErrorObjectType,
} from '../constants/system-errors';
import { setGlobalErrorObjectType } from '../utils/map-system-errors';

export type GlobalErrorObjectType = {
  error: ErrorObjectType;
};
export interface ApplicationException {
  error: ErrorObjectType;
}
export class BaseException implements ApplicationException {
  error: ErrorObjectType;
  constructor(error: ErrorObjectType) {
    this.error = error;
  }
}

export class CustomException extends BaseException {}

export class UnauthorizedException extends CustomException {
  constructor() {
    const error: ErrorObjectType = {
      code: ErrorCodes.UNAUTHORIZED_CODE,
      message: ErrorMessage.UNAUTHORIZED_REASON,
    };
    super(setGlobalErrorObjectType(error));
  }
}
export class InvalidPayloadException extends CustomException {
  constructor() {
    const error: ErrorObjectType = {
      code: ErrorCodes.ACCOUNT_PROVIDER_ERROR_CODE,
      message: ErrorMessage.ACCOUNT_PROVIDER_ERROR_REASON,
    };
    super(error);
  }
}
export class DefaultErrorException extends CustomException {
  constructor(error: ErrorObjectType) {
    super(setGlobalErrorObjectType(error));
  }
}
export class EntityDoesNotExistException extends CustomException {
  constructor() {
    const error: ErrorObjectType = {
      code: ErrorCodes.ENDPOINT_DOES_NOT_EXIST_CODE,
      message: ErrorMessage.ENDPOINT_DOES_NOT_EXIST_REASON,
    };
    super(setGlobalErrorObjectType(error));
  }
}
export class AlreadyExistException extends CustomException {
  constructor(error: ErrorObjectType) {
    super(setGlobalErrorObjectType(error));
  }
}
