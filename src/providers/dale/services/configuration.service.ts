import { RedisService } from './../../../db/redis/redis.service';
import { ErrorCodesEnum } from './../../../shared/code-errors/error-codes.enum';
import {
  ExternalApiExceptionDale,
  InternalServerExceptionDale,
} from '@dale/manage-errors-nestjs';
import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { createHeadersStructure } from '../utils/common';

@Injectable()
export class ConfigurationService {
  constructor(
    private httpService: HttpService,
    private redisService: RedisService,
  ) {}

  async getDocumentTypeNameById(id: string) {
    const documentShortName = await this.redisService.getCache(
      `DOCUMENT_NAME#${id}`,
    );
    if (documentShortName) {
      return documentShortName;
    }
    try {
      const url = `${process.env.CONFIGURATION_SERVICE_URL}/configuration/document-types/${id}`;
      const { data } = await lastValueFrom(
        this.httpService.get(url, {
          headers: createHeadersStructure(),
        }),
      );
      await this.redisService.setCache(
        `DOCUMENT_NAME#${id}`,
        data.data.shortName,
        86400,
      );
      return data.data.shortName;
    } catch (error) {
      this.validateErrorDale(error);
      throw new InternalServerExceptionDale(ErrorCodesEnum.ACN016, error);
    }
  }

  private validateErrorDale(error: AxiosError<any>) {
    if (error.response?.data?.error?.code) {
      throw new ExternalApiExceptionDale(
        error.response?.data?.error,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getDocumentTypeFullNameById(id: string) {
    const documentName = await this.redisService.getCache(
      `DOCUMENT_FULL_NAME#${id}`,
    );
    if (documentName) {
      return documentName;
    }
    try {
      const url = `${process.env.CONFIGURATION_SERVICE_URL}/configuration/document-types/${id}`;
      const { data } = await lastValueFrom(
        this.httpService.get(url, {
          headers: createHeadersStructure(),
        }),
      );
      await this.redisService.setCache(
        `DOCUMENT_FULL_NAME#${id}`,
        data.data.name,
        86400,
      );
      return data.data.name;
    } catch (error) {
      this.validateErrorDale(error);
      throw new InternalServerExceptionDale(ErrorCodesEnum.ACN016, error);
    }
  }
}
