import { HttpService } from '@nestjs/axios';
import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { lastValueFrom } from 'rxjs';
import { PtsResponse } from '../../modules/accounts/dto/pts.dto';
import {
  endpointsPTS,
  headersToken,
  PTS_USER_LOGIN,
  PTS_PASS_LOGIN,
  PTS_BASE_URL,
  PTS_REFRESH_TOKEN,
} from './constants/api';
import { CustomException } from '../../shared/custom-errors/custom-exception';
import { ErrorCodes } from '../../shared/constants/system-errors';
import { pts } from '../../constants/common';
import {
  AccountPTSEventDto,
  ModifyLimitsInputDto,
} from '../../modules/accounts/dto/accounts.dto';
import {
  AccountCreateRequest,
  AccountCreateResponse,
  AccountModifyLimitsRequest,
  AccountModifyLimitsResponse,
} from './dto/pts.dto';
import { ptsAccountCreate } from './constants/account.constans';
import {
  BadRequestExceptionDale,
  InternalServerExceptionDale,
  OkExceptionDale,
} from '@dale/manage-errors-nestjs';
import { ErrorCodesEnum } from '../../shared/code-errors/error-codes.enum';
import { Logger } from '@dale/logger-nestjs';
import { HeaderDTO } from '../../shared/models/common-header.dto';
import { v4 as uuid } from 'uuid';
import { clientStateEnum } from 'src/shared/enums/crm-enum';
@Injectable()
export class PtsService implements OnModuleInit {
  constructor(
    private httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private logger: Logger,
  ) {}

  async onModuleInit() {
    await this.updateGenerateToken();
    setInterval(async () => {
      await this.updateGenerateToken();
    }, Number(PTS_REFRESH_TOKEN) * 60 * 1000);
  }
  async getToken(key: string): Promise<string> {
    try {
      const token = await this.cacheManager.get(key);
      if (!token) {
        throw token;
      }
      return token;
    } catch (error) {
      console.log('error getToken', error);
      throw new CustomException({
        code: ErrorCodes.UNAUTHORIZED_CODE,
        message: `Error al intentar obtener el token de redisCache`,
      });
    }
  }
  async generateToken(): Promise<string> {
    try {
      const header = {
        'Content-Type': headersToken.contentType,
        pCHANNEL: headersToken.channel,
        Authorization: headersToken.authorization,
      };
      const auth = {
        username: PTS_USER_LOGIN,
        password: PTS_PASS_LOGIN,
      };
      process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
      const { data: response } = await lastValueFrom(
        this.httpService.post(
          `${PTS_BASE_URL}${endpointsPTS.TOKEN_URL}?grant_type=${headersToken.grantType}`,
          null,
          { headers: header, auth: auth },
        ),
      );
      console.log('response', response);
      return response.access_token;
    } catch (error) {
      console.log('error generateToken', error);
    }
  }
  async setTokenCache(token) {
    try {
      return await this.cacheManager.set(`token_pts`, token);
    } catch (error) {
      console.log('error setTokenCache', error);
    }
  }
  async updateGenerateToken() {
    const token = await this.generateToken();
    return await this.setTokenCache(token);
  }
  async get(url: string): Promise<PtsResponse> {
    try {
      const token = await this.cacheManager.get('token_pts');
      const header = {
        Authorization: 'Bearer ' + token,
        'Content-Type': pts.PTS_CONTENT_TYPE_JSON,
        CHANNEL: pts.PTS_pCHANNEL,
      };
      const { data: response } = await lastValueFrom(
        this.httpService.get(`${url}`, {
          headers: header,
        }),
      );
      return response;
    } catch (error) {
      this.logger.error(`Error `, error.message);
      if (error.response.status === 400) {
        throw new BadRequestExceptionDale(ErrorCodesEnum.ACN009, error.message);
      }
      throw new InternalServerExceptionDale(ErrorCodesEnum.ACN009, error);
    }
  }

  async createAccount(
    event: AccountPTSEventDto,
  ): Promise<AccountCreateResponse> {
    try {
      const request: AccountCreateRequest = {
        headerRQ: {
          msgId: ptsAccountCreate.PTS_MSG_ID,
        },
        securityRQ: {},
        messageRQ: {
          digitalService: ptsAccountCreate.PTS_DIGITAL_SERVICE,
          currency: ptsAccountCreate.PTS_CURRENCY,
          bankId: ptsAccountCreate.PTS_BANK_ID,
          customerExternalId: event.customerExternalNumber,
          account: {
            legacyId: {},
            othersId: [
              {
                identificationType: ptsAccountCreate.PTS_IDENTIFICATION_TYPE,
                identificationId: event.phoneNumber,
              },
            ],
          },
          additionals: {
            client_type: ptsAccountCreate.PTS_CLIENT_TYPE,
          },
          status: ptsAccountCreate.PTS_STATUS,
          thirdPartyAdditionalsBPA: {
            internalControls: {
              maxDepositBalance: ptsAccountCreate.PTS_MAX_DEPOSIT_BALANCE,
            },
          },
        },
      };

      const token = await this.cacheManager.get('token_pts');
      const header = {
        Authorization: 'Bearer ' + token,
        'Content-Type': ptsAccountCreate.PTS_CONTENT_TYPE,
        CHANNEL: ptsAccountCreate.PTS_pCHANNEL,
      };

      this.logger.log(
        `Request Pts Service create account ${JSON.stringify(request)}`,
        event.enrollmentId,
      );

      const url = `${process.env.PTS_API_URL}/${ptsAccountCreate.PTS_CREATE_ACCOUNT_INIT_PATH}/${event.bPartnerId}/${ptsAccountCreate.PTS_CREATE_ACCOUNT_END_PATH}`;
      const { data: response } = await lastValueFrom(
        this.httpService.post(`${url}`, request, {
          headers: header,
        }),
      );

      this.logger.log(
        `Response Pts Service create account`,
        event.enrollmentId,
      );

      this.logger.log(`${JSON.stringify(response)}`, event.enrollmentId);

      return response as AccountCreateResponse;
    } catch (error) {
      this.logger.log(
        `Call method to manage errors to create customer`,
        event.enrollmentId,
      );
      await this.manageErrorsToCreateCustomer(error);
    }
  }

  async manageErrorsToCreateCustomer(error: any) {
    this.logger.log(
      `Error call PTS service create account${JSON.stringify(error)}`,
    );
    if (error?.response?.data?.statusRS?.code == '-2407') {
      throw new BadRequestExceptionDale(ErrorCodesEnum.ACN003, error);
    } else {
      throw new OkExceptionDale(ErrorCodesEnum.ACN002, error);
    }
  }

  async modifyLimits(
    body: ModifyLimitsInputDto,
    headers: HeaderDTO,
  ): Promise<AccountModifyLimitsResponse> {
    try {
      const result: AccountModifyLimitsResponse = {
        accountId: body.accountId,
        accumulators: [],
      };
      body.accumulators = body.accumulators.filter(
        (accum) => accum.hasUpdates === true,
      );
      const token = await this.cacheManager.get('token_pts');

      const header = {
        Authorization: 'Bearer ' + token,
        'Content-Type': pts.PTS_CONTENT_TYPE_DALE,
        pCHANNEL: pts.PTS_pCHANNEL,
      };

      for (const [index, element] of body.accumulators.entries()) {
        let countModify =
          (await this.cacheManager.get(
            `modifyLimits:${element.accumulator}${body.accountId}`,
          )) || 0;

        if (countModify < element.permittedLimits) {
          const request: AccountModifyLimitsRequest = {
            headerRQ: {
              msgId: uuid(),
              timestamp: new Date().toISOString(),
            },
            securityRQ: {
              hostId: headers.IpAddress,
              channelId: 'BACKOFFICE',
            },
            messageRQ: {
              currency: 'COP',
              dailyAmountLimit: element.dailyAmountLimit.toString(),
              weeklyAmountLimit: '',
              dailyVolumeLimit: element.dailyQuantityLimit.toString(),
              weeklyVolumeLimit: '',
              monthlyAmountLimit: '',
              annualAmountLimit: '',
              monthlyVolumeLimit: '',
              annualVolumeLimit: '',
              accumulatorId: 'AC_DEB_PERSONALIZADO', //element.accumulator
              channelId: 'NONE',
              bdSegmentId: 'NONE',
              productId: 'NONE',
              digitalServiceId: 'NONE',
              operationId: '',
              instanceId: '',
              identificationType: endpointsPTS.TYPE_ACCOUNT,
              identificationId: body.accountId,
              serviceId: 'NONE',
            },
          };

          const url = `${PTS_BASE_URL}${endpointsPTS.MODIFY_LIMITS}`;
          const { data: response } = await lastValueFrom(
            this.httpService.post(`${url}`, request, {
              headers: header,
            }),
          );

          this.logger.log(
            `Response Pts Service modify user limits`,
            body.accountId,
          );

          this.logger.log(`${JSON.stringify(response)}`, body.accountId);

          countModify++;
          await this.cacheManager.set(
            `modifyLimits:${element.accumulator}${body.accountId}`,
            countModify,
          );
          result.accumulators[index] = response.statusRS;
          result.accumulators[index].idOption = element.idOption;
          result.accumulators[index].nameOption = element.nameOption;
          result.accumulators[index].availableModifications =
            element.permittedLimits - countModify;
        } else {
          result.accumulators[index] = {
            code: '200',
            idOption: element.idOption,
            nameOption: element.nameOption,
            description: `Se supero el limite de ${element.permittedLimits} intentos permimitos para modificar ${element.nameOption}`,
            availableModifications: element.permittedLimits - countModify,
          };
        }
      }
      return result;
    } catch (error) {
      if (error.response?.status) {
        throw new BadRequestExceptionDale(ErrorCodesEnum.ACN020, error);
      }
      throw new OkExceptionDale(ErrorCodesEnum.ACN021, error);
    }
  }

  async actualizarDepositoPTS(
    accountDeposit: number,
    state: clientStateEnum,
  ): Promise<any> {
    try {
      let param;
      const header = {
        'Content-Type': headersToken.contentType,
        pCHANNEL: headersToken.channel,
        Authorization: headersToken.authorization,
      };
      const auth = {
        username: PTS_USER_LOGIN,
        password: PTS_PASS_LOGIN,
      };
      process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
      if (state === clientStateEnum.EMBARGADO) {
        param = `${accountDeposit}/seizur`;
      } else if (state === clientStateEnum.CONGELADO) {
        param = `${accountDeposit}/change-status`;
      }
      const { data: response } = await lastValueFrom(
        this.httpService.post(
          `${PTS_BASE_URL}${endpointsPTS.EMBARGAR_DEPOSIT}/${param}`,
          null,
          { headers: header, auth: auth },
        ),
      );
      console.log('response service depositEmbargoPTS', response);
      return response;
    } catch (error) {
      console.log('error generateToken', error);
      throw new OkExceptionDale(ErrorCodesEnum.ACN001, error);
    }
  }
}
