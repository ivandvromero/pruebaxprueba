import { AxiosError } from 'axios';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { lastValueFrom, catchError } from 'rxjs';
import {
  CRM_SERVICE_URL,
  endpoints,
  CRM_USERNAME,
  CRM_PASSWORD,
} from './constants/api';
import { ErrorCodesEnum } from '../../shared/manage-errors/code-erros/error-codes.enum';
import { SecretsManager } from '../../shared/secrets-manager/secrets-manager';
import {
  CustomException,
  ExternalApiExceptionDale,
  InternalServerExceptionDale,
} from '@dale/manage-errors-nestjs';

@Injectable()
export class CrmService {
  constructor(
    private httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private secretManager: SecretsManager,
  ) {}

  async getClientOrigin(clientId: string) {
    try {
      // Redis get
      let dataClient = await this.cacheManager.get(`crm:client:${clientId}`);
      if (!dataClient || dataClient.length === 0) {
        const urlClient = `${CRM_SERVICE_URL}${endpoints.CONTACT}${clientId}`;
        dataClient = await this.get(urlClient);
        const dataClientEncrypt = await this.secretManager.cacheManagerEncrypt(
          JSON.stringify(dataClient),
        );
        await this.cacheManager.set(
          `crm:client:${clientId}`,
          dataClientEncrypt,
        );
      } else {
        dataClient = await this.secretManager.cacheManagerDecrypt(dataClient);
      }
      return dataClient;
    } catch (error) {
      if (error instanceof CustomException) {
        throw error;
      }
      throw new InternalServerExceptionDale(ErrorCodesEnum.MON010, error);
    }
  }
  async getClientDestination(clientId: string) {
    try {
      // Redis get
      let dataClient = await this.cacheManager.get(`crm:client:${clientId}`);

      if (!dataClient || dataClient.length === 0) {
        const urlClient = `${CRM_SERVICE_URL}${endpoints.CONTACT}${clientId}`;
        dataClient = await this.get(urlClient);
        const dataClientEncrypt = await this.secretManager.cacheManagerEncrypt(
          JSON.stringify(dataClient),
        );

        // Redis set
        await this.cacheManager.set(
          `crm:client:${clientId}`,
          dataClientEncrypt,
        );
      } else {
        dataClient = await this.secretManager.cacheManagerDecrypt(dataClient);
      }
      return dataClient;
    } catch (error) {
      if (error instanceof CustomException) {
        throw error;
      }
      throw new InternalServerExceptionDale(ErrorCodesEnum.MON011, error);
    }
  }

  async getProductOrigin(ordererCrmId: string, client) {
    try {
      // Redis get
      let dataProduct = await this.cacheManager.get(
        `crm:product:${ordererCrmId}`,
      );
      if (!dataProduct || dataProduct.length === 0) {
        const urlGetDeposit = `${CRM_SERVICE_URL}${endpoints.DEPOSIT}${client.clientOrigin.Field_K7_0001}`;
        dataProduct = await this.get(urlGetDeposit);
        const dataProductEncrypt = await this.secretManager.cacheManagerEncrypt(
          JSON.stringify(dataProduct),
        );
        await this.cacheManager.set(
          `crm:product:${ordererCrmId}`,
          dataProductEncrypt,
        );
      } else {
        dataProduct = await this.secretManager.cacheManagerDecrypt(dataProduct);
      }
      return dataProduct;
    } catch (error) {
      if (error instanceof CustomException) {
        throw error;
      }
      throw new InternalServerExceptionDale(ErrorCodesEnum.MON012, error);
    }
  }

  async getProductDestination(beneficiaryCrmId: string, client) {
    try {
      // Redis get
      let dataProduct = await this.cacheManager.get(
        `crm:product:${beneficiaryCrmId}`,
      );
      if (!dataProduct || dataProduct.length === 0) {
        const urlGetDeposit = `${CRM_SERVICE_URL}${endpoints.DEPOSIT}${client.clientDestination.Field_K7_0031}`;
        dataProduct = await this.get(urlGetDeposit);
        const dataProductEncrypt = await this.secretManager.cacheManagerEncrypt(
          JSON.stringify(dataProduct),
        );
        await this.cacheManager.set(
          `crm:product:${beneficiaryCrmId}`,
          dataProductEncrypt,
        );
      } else {
        dataProduct = await this.secretManager.cacheManagerDecrypt(dataProduct);
      }
      return dataProduct;
    } catch (error) {
      if (error instanceof CustomException) {
        throw error;
      }
      throw new InternalServerExceptionDale(ErrorCodesEnum.MON013, error);
    }
  }
  async get<Response>(url: string): Promise<Response> {
    const userName = CRM_USERNAME;
    const password = CRM_PASSWORD;
    const { data: response } = await lastValueFrom(
      this.httpService
        .get<Response>(url, {
          auth: {
            username: userName,
            password: password,
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            if (error.response?.status) {
              throw new ExternalApiExceptionDale(
                error,
                error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
              );
            }
            throw new InternalServerExceptionDale(ErrorCodesEnum.MON014, error);
          }),
        ),
    );
    return response;
  }
}
