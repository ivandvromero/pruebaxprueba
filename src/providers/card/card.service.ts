import { AxiosError } from 'axios';
import { Cache } from 'cache-manager';
import { HttpService } from '@nestjs/axios';
import { catchError, lastValueFrom } from 'rxjs';
import { CARD_SERVICE_URL, endpoints } from './constants/api';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { SecretsManager } from '../../shared/secrets-manager/secrets-manager';
import {
  CustomException,
  InternalServerExceptionDale,
} from '@dale/manage-errors-nestjs';
import { ErrorCodesEnum } from '../../shared/manage-errors/code-erros/error-codes.enum';
import { GetCardBasicResponse } from './dto/card-basic-response.dto';
import { HEADERS } from '../../shared/constants/headers';
import { HeaderDTO } from '../../shared/dto/header.dto';

@Injectable()
export class CardService {
  constructor(
    private httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private secretManager: SecretsManager,
  ) {}

  async getCardAddress(userId: string) {
    try {
      // Redis get
      let dataCardAddress = await this.cacheManager.get(
        `card:address:${userId}`,
      );
      if (!dataCardAddress || dataCardAddress.length === 0) {
        const urlCard = `${CARD_SERVICE_URL}${endpoints.BASIC}${userId}`;
        dataCardAddress = await this.httpGet(urlCard, HEADERS);
        if (dataCardAddress?.data?.cardId) {
          const dataCardAddressEncrypt =
            await this.secretManager.cacheManagerEncrypt(
              JSON.stringify(dataCardAddress),
            );
          await this.cacheManager.set(
            `card:address:${userId}`,
            dataCardAddressEncrypt,
          );
        }
      } else {
        dataCardAddress = await this.secretManager.cacheManagerDecrypt(
          dataCardAddress,
        );
      }
      return dataCardAddress;
    } catch (error) {
      if (error instanceof CustomException) {
        throw error;
      }
      throw new InternalServerExceptionDale(ErrorCodesEnum.MON028, error);
    }
  }

  async httpGet(
    url: string,
    headers: HeaderDTO,
  ): Promise<GetCardBasicResponse> {
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
          catchError((error: AxiosError<GetCardBasicResponse>) => {
            return [
              {
                data: {},
                error,
              },
            ];
          }),
        ),
    );
    return data;
  }
}
