import { UpdateValuesMissingError } from 'typeorm';

import {
  ErrorCodes,
  ErrorObjectType,
  ErrorMessage,
} from '../constants/system-errors';

export const mapSystemErrors = (error?): ErrorObjectType => {
  let errorResponse: ErrorObjectType = {
    code: ErrorCodes.INTERNAL_SERVER_ERROR_CODE,
    message: ErrorMessage.INTERNAL_SERVER_REASON,
  };

  if (error?.message === ErrorMessage.UNAUTHORIZED_ERROR) {
    errorResponse = unauthorizedError();
  } else if (error?.status === 404) {
    errorResponse = endPointDoesNotExistError();
  } else if (error?.status === 403) {
    errorResponse = forbiddenResourceError();
  } else if (error?.name === UpdateValuesMissingError.name) {
    errorResponse = entityUpdateValuesMissingError();
  } else if (error?.code === '23505') {
    errorResponse = entityAlreadyExistsError();
  }

  return errorResponse;
};

const unauthorizedError = (): ErrorObjectType => {
  return {
    code: ErrorCodes.UNAUTHORIZED_CODE,
    message: ErrorMessage.UNAUTHORIZED_REASON,
  };
};

export const setGlobalErrorObjectType = (
  error: ErrorObjectType,
): ErrorObjectType => {
  return error;
};

const endPointDoesNotExistError = () => {
  return {
    code: ErrorCodes.ENDPOINT_DOES_NOT_EXIST_INTERNAL_CODE,
    message: ErrorMessage.ENDPOINT_DOES_NOT_EXIST_INTERNAL_REASON,
  };
};

const forbiddenResourceError = () => {
  return {
    code: ErrorCodes.FORBIDDEN_RESOURCE_CODE,
    message: ErrorMessage.FORBIDDEN_RESOURCE_REASON,
  };
};
const invalidEntityError = (reason, details) => {
  return {
    code: ErrorCodes.INVALID_ENTITY_CODE,
    message: reason,
  };
};

const entityUpdateValuesMissingError = () => {
  return {
    code: ErrorCodes.UPDATE_VALUES_MISSING_CODE,
    message: ErrorMessage.UPDATE_VALUES_MISSING_REASON,
  };
};

const entityAlreadyExistsError = () => {
  return {
    code: ErrorCodes.ENTITY_ALREADY_EXISTS_CODE,
    message: ErrorMessage.ENTITY_ALREADY_EXISTS_REASON,
  };
};
