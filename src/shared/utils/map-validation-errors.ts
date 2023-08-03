import { ErrorCodes, ErrorObjectType } from '../constants/system-errors';

export const mapValidationErrors = (errors: string[]): ErrorObjectType[] =>
  errors.map((error): ErrorObjectType => {
    return {
      code: ErrorCodes.VALIDATION_ERROR_CODE,
      message: error,
    };
  });

export const ErrorObjectTypeToString = (
  code: string,
  message: string,
): string => {
  return JSON.stringify({
    error: {
      code,
      message,
    },
  });
};
