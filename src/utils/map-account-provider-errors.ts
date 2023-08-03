import { ErrorCodes, ErrorObjectType } from '../shared/constants/system-errors';

/**
 * This mapping is for Mambu provider
 * If provider other than Mambu, add specific error mapping
 * logic here
 * */
export const mapAccountProviderErrors = (errorObject): ErrorObjectType => {
  let providerErrors = errorObject.response?.data.errors || [];
  if (!providerErrors.length) {
    providerErrors = getAttributeObjectError(errorObject);
  }
  return providerErrors.map((error): ErrorObjectType => {
    return {
      code: ErrorCodes.ACCOUNT_PROVIDER_ERROR_CODE,
      message: error?.errorReason?.toLowerCase(),
    };
  });
};
/**
 * This mapping is for Service 404
 * logic here
 * */
const getAttributeObjectError = (errorObject) => {
  const providerErrors = [];
  providerErrors.push({
    errorReason: errorObject.message,
  });
  return providerErrors;
};
