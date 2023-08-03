import { HttpStatus } from '@nestjs/common';
export type CustomErrorType = {
  code: string;
  message: string;
};
export class ProviderException {
  error: CustomErrorType;
  statusCode: number;
  constructor(exeptionCode: string) {
    this.statusCode = 420;
    this.error = {
      code: '',
      message: '',
    };
    switch (exeptionCode) {
      case '-1056':
        this.error.code = 'PTS001';
        this.error.message = 'La cuenta no existe';
        break;
      case '-1706':
        this.error.code = 'PTS002';
        this.error.message = 'Acumulador no encontrado';
        break;
      case '428':
        this.error.code = 'MBU001';
        this.error.message = 'La cuenta no existe';
        break;
      default:
        this.error.code = 'ACS001';
        this.error.message = 'Intente de nuevo más tarde';
        this.statusCode = HttpStatus.BAD_REQUEST;
        break;
    }
  }
}
