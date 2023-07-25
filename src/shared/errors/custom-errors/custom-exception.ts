import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCodesEnum } from '../code-errors/error-codes.enum';

class BaseException extends HttpException {
  constructor(code: ErrorCodesEnum, error: any, httpStatus: HttpStatus) {
    super({ code, error }, httpStatus);
  }
}

export class CustomException extends BaseException {}

export class UnauthorizedException extends CustomException {
  constructor(code: ErrorCodesEnum, error: any) {
    super(code, error, HttpStatus.UNAUTHORIZED);
  }
}

export class BadRequestException extends CustomException {
  constructor(code: ErrorCodesEnum, error: any) {
    super(code, error, HttpStatus.BAD_REQUEST);
  }
}

export class NotFoundException extends CustomException {
  constructor(code: ErrorCodesEnum, error: any) {
    super(code, error, HttpStatus.NOT_FOUND);
  }
}

export class InternalServerException extends CustomException {
  constructor(code: ErrorCodesEnum, error: any) {
    super(code, error, HttpStatus.BAD_REQUEST);
  }
}

export class ExternalException extends CustomException {
  constructor(error: any, httpStatus: HttpStatus) {
    super(null, error, httpStatus);
  }
}
