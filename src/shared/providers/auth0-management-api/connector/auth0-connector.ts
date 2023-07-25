import { Injectable, Optional } from '@nestjs/common';
import { AxiosAdapter } from '../../http-adapters/axios-adapter';

import { ConfigService } from '@nestjs/config';
import { AuthGetRoles } from '../dto/auth-get-roles.dto';
import { AuthGetUsers } from '../dto/auth-get-users.dto';
import { AuthTokenDto } from '../dto/auth-token-dto';
import { AuthGetRolByIdDto } from '../dto/auth-get-rol-by-id.dto';
import { Logger } from '@dale/logger-nestjs';
@Injectable()
export class Auth0Connector {
  constructor(
    private readonly configService: ConfigService,
    private readonly http: AxiosAdapter,
    @Optional() private logger?: Logger,
  ) {}

  private root = this.configService.get('config.auth.rootPath');
  private rootToken = `${this.root}/oauth/token`;
  private header = {
    'content-type': 'application/json',
  };
  private body = {
    client_id: this.configService.get('config.auth.clientId'),
    client_secret: this.configService.get('config.auth.authSecret'),
    audience: `${this.root}/api/v2/`,
    grant_type: 'client_credentials',
  };

  async getAuthRoles(token: string): Promise<AuthGetRoles[]> {
    const url = `${this.root}/api/v2/roles`;
    const headers = {
      Authorization: token,
    };
    const response = await this.http.get<AuthGetRoles[]>(url, headers);
    return response;
  }

  async getAuthUsers(token: string): Promise<AuthGetUsers> {
    const url = `${this.root}/api/v2/users`;
    const headers = {
      Authorization: token,
    };
    const response = await this.http.get<AuthGetUsers>(url, headers);
    return response;
  }
  async getAuthToken(): Promise<AuthTokenDto> {
    const url = `${this.rootToken}`;
    const response = await this.http.post<AuthTokenDto>(
      url,
      this.header,
      this.body,
    );
    return response;
  }

  async getRolById(rolId: string, token: string): Promise<AuthGetRolByIdDto[]> {
    const url = `${this.root}/api/v2/roles/${rolId}/users`;
    const headers = {
      Authorization: token,
    };
    const response = await this.http.get<AuthGetRolByIdDto[]>(url, headers);
    return response;
  }

  async getUserByIdRol(nameUser: string, token): Promise<AuthGetUsers> {
    const url = `${this.root}/api/v2/users/${nameUser}`;
    const headers = {
      Authorization: token,
    };
    const response = await this.http.get<AuthGetUsers>(url, headers);
    return response;
  }

  async getAllUsers(token: string, page: number): Promise<AuthGetUsers[]> {
    const url = `${this.root}/api/v2/users?per_page=100&page=${page}&q=identities.connection="backoffice"`;
    const headers = {
      Authorization: token,
    };
    const response = await this.http.get<AuthGetUsers[]>(url, headers);
    return response;
  }
}
