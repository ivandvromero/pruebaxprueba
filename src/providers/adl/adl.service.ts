import { HttpService } from '@nestjs/axios';
import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { lastValueFrom } from 'rxjs';
import {
  ADL_AUGUSTA_API,
  ADL_AUGUSTA_API_KEY,
  endpointsADL,
} from './constants/api';
import {
  BadRequestExceptionDale,
  InternalServerExceptionDale,
} from '@dale/manage-errors-nestjs';
import { ErrorCodesEnum } from '../../shared/code-errors/error-codes.enum';
import { Logger } from '@dale/logger-nestjs';
import { PTS_REFRESH_TOKEN } from '../pts/constants/api';
import { AdlCheckTrxInput, AdlCheckTrxOutput } from './dto/adl.check.trx.dto';
import {
  AdlCheckTrxReportInput,
  AdlCheckTrxReportOutput,
} from './dto/adl.check.report.dto';

@Injectable()
export class AdlService implements OnModuleInit {
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
  async generateTokenAdl(): Promise<string> {
    try {
      const header = {
        'X-API-Key': ADL_AUGUSTA_API_KEY,
      };
      const { data: response } = await lastValueFrom(
        this.httpService.post(
          `${ADL_AUGUSTA_API}${endpointsADL.ADL_AUTH}`,
          { unique_id: 'mine_postman_12345' },
          { headers: header },
        ),
      );
      console.log('response auth ADL', response);
      return response.cognito_token.access_token;
    } catch (error) {
      console.log('error generateToken', error);
    }
  }
  async setTokenCacheAdl(token) {
    try {
      return await this.cacheManager.set(`token_adl`, token);
    } catch (error) {
      console.log('error setTokenCache', error);
    }
  }
  async updateGenerateToken() {
    const token = await this.generateTokenAdl();
    return await this.setTokenCacheAdl(token);
  }
  async checkTrx(adlCheckTrxDto: AdlCheckTrxInput): Promise<AdlCheckTrxOutput> {
    try {
      const token = await this.cacheManager.get('token_adl');
      const header = {
        Authorization: 'Bearer ' + token,
        'X-API-Key': ADL_AUGUSTA_API_KEY,
      };
      const { data: response } = await lastValueFrom(
        this.httpService.post(
          `${ADL_AUGUSTA_API}${endpointsADL.ADL_CHECK_TRX}`,
          adlCheckTrxDto,
          {
            headers: header,
          },
        ),
      );
      return response;
    } catch (error) {
      this.logger.error(`Error `, error.message);
      if (error.status === 400) {
        throw new BadRequestExceptionDale(ErrorCodesEnum.ACN017, error.message);
      }
      throw new InternalServerExceptionDale(ErrorCodesEnum.ACN017, error);
    }
  }

  async checkTrxReport(
    adlCheckTrxReportInput: AdlCheckTrxReportInput,
  ): Promise<AdlCheckTrxReportOutput> {
    try {
      const token = await this.cacheManager.get('token_adl');
      const header = {
        Authorization: 'Bearer ' + token,
        'X-API-Key': ADL_AUGUSTA_API_KEY,
      };
      const { data: response } = await lastValueFrom(
        this.httpService.post(
          `${ADL_AUGUSTA_API}${endpointsADL.ADL_CHECK_REPORT}`,
          adlCheckTrxReportInput,
          {
            headers: header,
          },
        ),
      );
      return response;
    } catch (error) {
      this.logger.error(`Error `, error.message);
      if (error.status === 400) {
        throw new BadRequestExceptionDale(ErrorCodesEnum.ACN017, error.message);
      }
      throw new InternalServerExceptionDale(ErrorCodesEnum.ACN017, error);
    }
  }
}
