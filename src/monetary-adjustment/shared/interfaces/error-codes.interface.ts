import { ErrorCodesEnum } from '@dale/exceptions//code-errors/error-codes.enum';

export interface IErrorCodes {
  code: ErrorCodesEnum;
  message: string;
  description: string;
}
