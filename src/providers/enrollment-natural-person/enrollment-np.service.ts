//Libraries
import { AxiosError } from 'axios';
import { Cache } from 'cache-manager';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, catchError } from 'rxjs';
import { CACHE_MANAGER, HttpStatus, Inject, Injectable } from '@nestjs/common';

//Data Transfer Objects (DTO)
import { DetailtDeviceDataResponse } from './dto/device-response.dto';

//Error Handling
import {
  CustomException,
  ExternalApiExceptionDale,
  InternalServerExceptionDale,
} from '@dale/manage-errors-nestjs';

//Enums
import { ErrorCodesEnum } from '../../shared/manage-errors/code-erros/error-codes.enum';

//Secrets Managers
import { SecretsManager } from '../../shared/secrets-manager/secrets-manager';

@Injectable()
export class EnrollmentNaturalPersonService {
  constructor(
    private httpService: HttpService,
    private secretManager: SecretsManager,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getDeviceInformation(
    enrollmentPN_id: string,
    headers: any,
  ): Promise<DetailtDeviceDataResponse> {
    try {
      let dataDevice = await this.cacheManager.get(`device:${enrollmentPN_id}`);

      if (!dataDevice || dataDevice.length === 0) {
        const url = `${process.env.ENROLLMENT_NP_SERVICE_URL}/enrollment-natural-person/device/${enrollmentPN_id}`;
        dataDevice = await this.httpGet(url, headers);
        const dataDeviceEncrypt = await this.secretManager.cacheManagerEncrypt(
          JSON.stringify(dataDevice),
        );
        await this.cacheManager.set(
          `device:${enrollmentPN_id}`,
          dataDeviceEncrypt,
        );
      } else {
        dataDevice = await this.secretManager.cacheManagerDecrypt(dataDevice);
      }
      return dataDevice;
    } catch (error) {
      if (error instanceof CustomException) {
        throw error;
      }
      throw new InternalServerExceptionDale(ErrorCodesEnum.MON016, error);
    }
  }

  async httpGet(url: string, headers: any): Promise<DetailtDeviceDataResponse> {
    const { data } = await lastValueFrom(
      this.httpService
        .get(url, {
          headers: {
            'Content-Type': 'application/json',
            ApiVersion: headers.ApiVersion,
            TransactionId: headers.TransactionId,
            ChannelId: headers.ChannelId,
            SessionId: headers.SessionId,
            Timestamp: headers.Timestamp,
            IpAddress: headers.IpAddress,
            Application: headers.Application,
          },
        })
        .pipe(
          catchError((error: AxiosError<DetailtDeviceDataResponse>) => {
            if (
              error.response?.data?.error?.code &&
              error.response?.data?.error?.description
            ) {
              throw new ExternalApiExceptionDale(
                error.response?.data?.error,
                error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
              );
            }
            throw new InternalServerExceptionDale(ErrorCodesEnum.MON017, error);
          }),
        ),
    );
    return data;
  }
}
