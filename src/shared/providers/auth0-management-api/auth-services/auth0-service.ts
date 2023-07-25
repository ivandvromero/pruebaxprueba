import {
  BadRequestException,
  CACHE_MANAGER,
  CacheInterceptor,
  Inject,
  Optional,
  UseInterceptors,
} from '@nestjs/common';
import { Auth0Connector } from '../connector/auth0-connector';
import { AuthGetRoles } from '../dto/auth-get-roles.dto';
import { AuthGetUsers } from '../../../../shared/providers/auth0-management-api/dto/auth-get-users.dto';
import { AuthGetRolByIdDto } from '../../../../shared/providers/auth0-management-api/dto/auth-get-rol-by-id.dto';
import { Cache } from 'cache-manager';
import { AuthGetEmailByParams } from '../dto/auth-get-email-by-params';
import { ErrorCodesEnum } from '@dale/exceptions/code-errors/error-codes.enum';
import { SecretsManager } from '../../../secrets-manager/secrets-manager';
import { Logger } from '@dale/logger-nestjs';
import { TTL_REDIS_CONFIG } from '../../../config/redis-config';

@UseInterceptors(CacheInterceptor)
export class Auth0Service {
  constructor(
    @Inject(Auth0Connector)
    private readonly authConnector: Auth0Connector,
    private readonly secretManager: SecretsManager,
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
    @Optional() private logger?: Logger,
  ) {}

  async getAuthRoles(): Promise<AuthGetRoles[]> {
    try {
      const keyAuth0 = 'GetRolesAuth0M2M';
      let roles = await this.cache.get<AuthGetRoles[]>(keyAuth0);
      const token = await this.getAuthToken();
      if (!roles) {
        roles = await this.authConnector.getAuthRoles(token);
        await this.cache.set<AuthGetUsers>(keyAuth0, roles, 86400);
      }
      return roles;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(
        ErrorCodesEnum.BOS026,
        'No se encontraron roles',
      );
    }
  }

  async getUserByIdRol(idRol: string): Promise<AuthGetUsers> {
    try {
      const token = await this.getAuthToken();
      const resp = await this.authConnector.getUserByIdRol(idRol, token);
      return resp;
    } catch (error) {
      throw new BadRequestException(
        ErrorCodesEnum.BOS027,
        'Error al obtener usuario o id incorrecto , verifica nuevamente',
      );
    }
  }

  async getAuthToken(): Promise<string> {
    try {
      const keyAuth0 = 'Auth0TokenM2M';
      let token = await this.cache.get<string>(keyAuth0);
      if (!token || token.length === 0) {
        const rawToken = await this.authConnector.getAuthToken();
        token = `${rawToken.token_type} ${rawToken.access_token}`;
        await this.cache.set<string>(keyAuth0, token, {
          ttl: TTL_REDIS_CONFIG.AUTH_TOKEN_M2M_TIME,
        });
      }
      return token;
    } catch (error) {
      this.logger.debug(error);
      throw new BadRequestException(
        ErrorCodesEnum.BOS027,
        'Error al obtener usuario o id incorrecto , verifica nuevamente',
      );
    }
  }

  async getRolById(id: string): Promise<AuthGetRolByIdDto[]> {
    try {
      const key = `usersRolAuth0M2M:${id}`;
      const token = await this.getAuthToken();
      let roles = await this.cache.get<AuthGetRolByIdDto[]>(key);
      if (!roles) {
        roles = await this.authConnector.getRolById(id, token);
        await this.cache.set<AuthGetUsers>(key, roles, { ttl: 900 });
      }
      return roles;
    } catch (error) {
      throw new BadRequestException(
        ErrorCodesEnum.BOS028,
        'Error al obtener rol o id incorrecto , verifica nuevamente',
      );
    }
  }

  async getAllUsers(): Promise<AuthGetUsers[]> {
    try {
      const key = 'usersDataAuth0M2M';
      const token = await this.getAuthToken();
      let users = await this.cache.get<AuthGetUsers[]>(key);
      if (!users) {
        users = await this.authConnector.getAllUsers(token, 0);
        let currentPage = 0;
        while (users.length === 100 * (currentPage + 1)) {
          currentPage++;
          const nextPage = await this.authConnector.getAllUsers(
            token,
            currentPage,
          );
          users = [...users, ...nextPage];
        }
        await this.cache.set<AuthGetUsers>(key, users, { ttl: 900 });
      }
      return users;
    } catch (error) {
      throw new BadRequestException(
        ErrorCodesEnum.BOS031,
        'Error al buscar usuarios, revisa logs',
      );
    }
  }

  async getEmailByParams(rolName: string[]): Promise<AuthGetEmailByParams[]> {
    const roles = await this.getAuthRoles();
    try {
      const result: AuthGetEmailByParams[] = [];
      await Promise.all(
        roles.map(async (role) => {
          if (rolName.includes(role.name)) {
            const rolData = await this.getRolById(role.id);
            const allUsers = await this.getAllUsers();
            rolData.forEach((userByRole) => {
              const email = userByRole.email;
              const foundUser = allUsers.find((user) => user.email === email);
              if (foundUser && !foundUser?.blocked) {
                result.push({
                  email: email,
                });
              }
            });
          }
        }),
      );
      return result;
    } catch (error) {
      throw new BadRequestException(
        ErrorCodesEnum.BOS029,
        'No se encontraron correos',
      );
    }
  }
}
