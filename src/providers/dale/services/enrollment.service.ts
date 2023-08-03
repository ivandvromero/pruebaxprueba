import { ErrorCodesEnum } from './../../../shared/code-errors/error-codes.enum';
import {
  CustomException,
  ExternalApiExceptionDale,
  InternalServerExceptionDale,
  OkExceptionDale,
} from '@dale/manage-errors-nestjs';
import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { createHeadersStructure } from '../utils/common';
import { UserDto } from '../dto/enrollment.dto';
import { AxiosError } from 'axios';

@Injectable()
export class EnrollmentService {
  constructor(readonly httpService: HttpService) {}

  async getUserDataByEnrollmentId(enrollmentId: string): Promise<UserDto> {
    try {
      const url = `${process.env.ENROLLMENT_NATURAL_PERSON_SERVICE_URL}/enrollment-natural-person/${enrollmentId}`;
      const { data } = await lastValueFrom(
        this.httpService.get(url, {
          headers: createHeadersStructure(),
        }),
      );
      if (!data.data.person)
        throw new OkExceptionDale(
          ErrorCodesEnum.ACN001,
          'No se encontró la informacion del usuario en Enrollment',
        );

      return data.data as UserDto;
    } catch (error) {
      this.validateErrorDale(error);
      throw new InternalServerExceptionDale(ErrorCodesEnum.ACN015, error);
    }
  }
  validateErrorDale(error: AxiosError<any>) {
    if (error.response?.data?.error?.code) {
      throw new ExternalApiExceptionDale(
        error.response?.data?.error,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    if (error instanceof CustomException) {
      throw error;
    }
  }
}
