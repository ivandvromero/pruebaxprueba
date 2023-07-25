import { Logger } from '@dale/logger-nestjs';
import {
  ExternalApiExceptionDale,
  InternalServerExceptionDale,
} from '@dale/manage-errors-nestjs';
import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable } from '@nestjs/common';
import { catchError, lastValueFrom } from 'rxjs';
import { ErrorCodesEnum } from '../../../shared/manage-errors/code-erros/error-codes.enum';
import { AxiosError } from 'axios';
import { v4 as uuid } from 'uuid';
import { getServiceIp } from '../../../utils/get-service-ip';

@Injectable()
export class ConfigurationService {
  constructor(private httpService: HttpService, private logger: Logger) {}

  async getDocumentTypeById(id: string) {
    this.logger.log(
      'getDocumentTypeById - Begin call to configuration service',
    );
    const url = `${process.env.CONFIGURATION_SERVICE_URL}/configuration/document-types/${id}`;
    const { data } = await lastValueFrom(
      this.httpService
        .get(url, {
          headers: this.createHeadersStructure(),
        })
        .pipe(
          catchError((error: AxiosError<any>) => {
            this.logger.log(
              'getDocumentTypeById - Error when call to configuration service',
            );
            this.validateErrorDale(error);
            throw new InternalServerExceptionDale(ErrorCodesEnum.MON022, error);
          }),
        ),
    );
    this.logger.log('getDocumentTypeById - End call to configuration service');
    return data;
  }

  async getGenders() {
    this.logger.log('getGenderTypeById - Begin call to configuration service');
    const url = `${process.env.CONFIGURATION_SERVICE_URL}/genders`;
    const { data } = await lastValueFrom(
      this.httpService
        .get(url, {
          headers: this.createHeadersStructure(),
        })
        .pipe(
          catchError((error: AxiosError<any>) => {
            this.logger.log(
              'getGenderTypeById - Error when call to configuration service: ' +
                JSON.stringify(error),
            );
            this.validateErrorDale(error);
            throw new InternalServerExceptionDale(ErrorCodesEnum.MON023, error);
          }),
        ),
    );
    this.logger.log(
      'getGenderTypeById - End call to configuration service with return: ' +
        JSON.stringify(data),
    );
    return data;
  }

  async getCodeGenderByProvider(
    genderId: string,
    providerId: string,
  ): Promise<string> {
    const url = `${process.env.CONFIGURATION_SERVICE_URL}/genders/${genderId}/provider/${providerId}`;
    const { data } = await lastValueFrom(
      this.httpService
        .get(url, {
          headers: this.createHeadersStructure(),
        })
        .pipe(
          catchError((error: AxiosError<any>) => {
            this.validateErrorDale(error);
            throw new InternalServerExceptionDale(ErrorCodesEnum.MON024, error);
          }),
        ),
    );
    this.logger.log(
      'getGenderTypeById - End call to configuration service with return: ' +
        JSON.stringify(data),
    );
    return data.data.code;
  }

  async getCrmAgreementCode(agreementId: string) {
    this.logger.log(
      'getCrmAgreementCode - Begin call to configuration service',
    );
    const url = `${process.env.CONFIGURATION_SERVICE_URL}/configuration/agreements/${agreementId}/provider/CRM`;
    const { data } = await lastValueFrom(
      this.httpService
        .get(url, {
          headers: this.createHeadersStructure(),
        })
        .pipe(
          catchError((error: AxiosError<any>) => {
            this.logger.log(
              'getCrmAgreementCode - Error when call to configuration service: ' +
                JSON.stringify(error),
            );
            this.validateErrorDale(error);
            throw new InternalServerExceptionDale(ErrorCodesEnum.MON025, error);
          }),
        ),
    );
    this.logger.log(
      'getCrmAgreementCode - End call to configuration service with return: ' +
        JSON.stringify(data),
    );
    return data.data.code;
  }

  private validateErrorDale(error: AxiosError<any>) {
    if (error.response?.data?.error?.code) {
      throw new ExternalApiExceptionDale(
        error.response?.data?.error,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  createHeadersStructure() {
    const TransactionId = uuid();
    const ChannelId = 'Monitor-service';
    const SessionId = uuid();
    const Timestamp = new Date().toISOString();
    const ip = getServiceIp();
    const [key] = Object.keys(ip);
    const [ipNest] = ip[key];
    const IpAddress = ipNest;
    const Application = 'Monitor-service';
    const ApiVersion = 1;
    return {
      TransactionId,
      ChannelId,
      SessionId,
      Timestamp,
      IpAddress,
      Application,
      ApiVersion,
    };
  }
}
