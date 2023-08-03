export type ErrorObjectType = {
  code: ErrorCodes;
  message: string;
};

export type OverrideSystemErrorValues = Partial<Omit<ErrorObjectType, 'code'>>;

export enum ErrorCodes {
  // Validation error codes starts with 2000
  DEFAULT_CODE = 2000,
  VERIFY_EMAIL_CODE,
  APPLICANT_NOT_CREATED_CODE,
  USER_DOES_NOT_EXIST_CODE,
  UPDATE_VALUES_MISSING_CODE,
  ENTITY_ALREADY_EXISTS_CODE,
  ENTITY_DOES_NOT_EXIST_CODE,
  INVALID_ENTITY_CODE,
  FORBIDDEN_RESOURCE_CODE,
  KYC_PROVIDER_ERROR_CODE = 3000,
  TRANSACTION_PROVIDER_ERROR_CODE = 5000,
  AUTH_PROVIDER_ERROR_CODE = 6000,
  OTP_PROVIDER_ERROR = 7000,
  PRODUCT_PROVIDER_ERROR_CODE = 8000,
  VALIDATION_ERROR_CODE = 9000,
  VERIFY_ACCOUNTHOLDERID_CODE = 'ACS001',
  VERIFY_TRACKINGID_CODE = 'ACS002',
  UNAUTHORIZED_CODE = 'ACS003',
  ENDPOINT_DOES_NOT_EXIST_CODE = 'ACS004',
  INTERNAL_SERVER_ERROR_CODE = 'ACS005',
  INTERNAL_SERVER_CLIENT_ERROR_CODE = 'ACS006',
  ACCOUNT_PROVIDER_ERROR_CODE = 'ACS007',
  ENDPOINT_DOES_NOT_EXIST_INTERNAL_CODE = 'ACS008',
}

export enum ErrorMessage {
  VERIFY_VALIDATION_REASON = 'Todos los campos son requeridos.',
  UNAUTHORIZED_REASON = 'Acceso no autorizado.',
  ENDPOINT_DOES_NOT_EXIST_REASON = 'Error de comunicación Proveedor.',
  INTERNAL_SERVER_REASON = 'La solicitud de servicio falló.',
  INTERNAL_SERVER_CLIENT_REASON = 'La solicitud de servicio del proveedor falló.',
  ACCOUNT_PROVIDER_ERROR_REASON = 'La solicitud de servicio del proveedor es inválida.',
  ENDPOINT_DOES_NOT_EXIST_INTERNAL_REASON = 'La URL del servicio es incorrecta.',
  UPDATE_VALUES_MISSING_REASON = 'update_values_missing',
  ENTITY_ALREADY_EXISTS_REASON = 'entity_already_exists',
  DEFAULT_REASON = 'internal_server_error',
  FORBIDDEN_RESOURCE_REASON = 'forbidden_resource',
  UNAUTHORIZED_DETAIL = 'Unauthorized access',
  INVALID_PAYLOAD_ERROR = 'Invalid payload',
  UNAUTHORIZED_ERROR = 'Unauthorized',
  SYSTEM_SOURCE = 'system',
}
