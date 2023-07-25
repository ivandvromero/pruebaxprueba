import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Logger } from '@dale/logger-nestjs';
import { AxiosAdapter } from '@dale/http-adapters/axios-adapter';
import { ConfigService } from '@nestjs/config';
import { InternalServerExceptionDale } from '@dale/manage-errors-nestjs';
import { ErrorCodesEnum } from '@dale/exceptions/code-errors/error-codes.enum';
import { TTL_REDIS_CONFIG } from '../../../../shared/config/redis-config';

@Injectable()
export class PtsTokenManager implements OnModuleInit {
  constructor(
    private httpService: AxiosAdapter,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private logger: Logger,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    try {
      await this.updateGenerateToken();
      setInterval(async () => {
        try {
          await this.deleteTokenCache();
          await this.updateGenerateToken();
          this.logger.debug('Pts Token Updated');
        } catch (error) {
          this.logger.error('Error updating token', error);
        }
      }, 3600 * 1000);
    } catch (error) {
      this.logger.error('Error initializing token module', error);
    }
  }

  headersToken = {
    contentType: 'application/x-www-form-urlencoded',
    pCHANNEL: 'BACKOFFICE',
    authorization: 'Basic',
  };

  tokenKey = 'BackOfficePtsToken';

  async getToken(): Promise<string> {
    this.logger.log('Get token service started');
    try {
      const actualDate = new Date().getTime();
      let token = await this.cacheManager.get(this.tokenKey);
      if (!token) {
        token = await this.generateToken();
        await this.cacheManager.set(this.tokenKey, token, {
          ttl: TTL_REDIS_CONFIG.PTS_AUTH_TOKEN_TIME,
        });
      }
      if (token.expires <= actualDate / 1000) {
        token = await this.generateToken();
        await this.cacheManager.set(this.tokenKey, token, {
          ttl: TTL_REDIS_CONFIG.PTS_AUTH_TOKEN_TIME,
        });
      }
      return token.token;
    } catch (error) {
      this.logger.error(error);
      await this.deleteTokenCache();
      throw new InternalServerExceptionDale(
        ErrorCodesEnum.BOS032,
        'Error al obtener token',
      );
    }
  }

  async generateToken(): Promise<any> {
    this.logger.log('Generate token service started');
    try {
      const auth = {
        username: this.configService.get('config.pts.user'),
        password: this.configService.get('config.pts.password'),
      };
      const url = this.configService.get('config.pts.baseUrl');

      const resp: any = await this.httpService.post(
        `${url}/adaptorOAS/auth/login?grant_type=client_credentials`,
        this.headersToken,
        null,
        null,
        auth,
      );
      return { token: resp.access_token, expires: resp.expires_in };
    } catch (error) {
      this.logger.error(error);
      await this.deleteTokenCache();
      throw new InternalServerExceptionDale(
        ErrorCodesEnum.BOS034,
        'Error al generar token',
      );
    }
  }

  async setTokenCache(token) {
    this.logger.log('Generate token service started');
    try {
      return await this.cacheManager.set(this.tokenKey, token, {
        ttl: TTL_REDIS_CONFIG.PTS_AUTH_TOKEN_TIME,
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  async deleteTokenCache() {
    this.logger.log('Deleting token service started');
    try {
      await this.cacheManager.del(this.tokenKey);
    } catch (error) {
      throw new InternalServerExceptionDale(
        ErrorCodesEnum.BOS035,
        'Error al eliminar el token',
      );
    }
  }

  async updateGenerateToken() {
    this.logger.log('Update token service started');
    const token = await this.generateToken();
    return await this.setTokenCache(token);
  }
}
