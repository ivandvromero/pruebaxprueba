//Libraries
import { AxiosError } from 'axios';
import { Cache } from 'cache-manager';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, catchError } from 'rxjs';
import { CACHE_MANAGER, HttpStatus, Inject, Injectable } from '@nestjs/common';

//Data Transfer Objects (DTO)
import { GetUserResponse } from './dto/user-response.dto';

//Error Handling
import {
  CustomException,
  ExternalApiExceptionDale,
  InternalServerExceptionDale,
} from '@dale/manage-errors-nestjs';

//Enums
import { ErrorCodesEnum } from '../../shared/manage-errors/code-erros/error-codes.enum';

//Secrects Managers
import { SecretsManager } from '../../shared/secrets-manager/secrets-manager';

@Injectable()
export class UserService {
  constructor(
    private httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private secretManager: SecretsManager,
  ) {}

  async getUser(phoneNumber: string) {
    try {
      let user = await this.cacheManager.get(`user:${phoneNumber}`);
      if (!user || user.length === 0) {
        const url = `${process.env.USER_SERVICE_URL}/user?phoneNumber=${phoneNumber}`;
        user = await this.httpGet(url);
        const userEncrypt = await this.secretManager.cacheManagerEncrypt(
          JSON.stringify(user),
        );
        await this.cacheManager.set(`user:${phoneNumber}`, userEncrypt);
      } else {
        user = await this.secretManager.cacheManagerDecrypt(user);
      }
      return user;
    } catch (error) {
      if (error instanceof CustomException) {
        throw error;
      }
      throw new InternalServerExceptionDale(ErrorCodesEnum.MON018, error);
    }
  }

  async httpGet(url: string): Promise<GetUserResponse> {
    const { data } = await lastValueFrom(
      this.httpService.get(url).pipe(
        catchError((error: AxiosError<GetUserResponse>) => {
          throw new InternalServerExceptionDale(ErrorCodesEnum.MON019, error);
        }),
      ),
    );
    if (data.error?.message == 'Usuario no encontrado') {
      throw new ExternalApiExceptionDale(data.error, HttpStatus.NOT_FOUND);
    }
    return data;
  }
}
