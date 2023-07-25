import { AuthGetEmailByParams } from '../providers/auth0-management-api/dto/auth-get-email-by-params';
import { AuthGetRolByIdDto } from '../providers/auth0-management-api/dto/auth-get-rol-by-id.dto';
import { AuthGetRoles } from '../providers/auth0-management-api/dto/auth-get-roles.dto';
import { AuthGetUsers } from '../providers/auth0-management-api/dto/auth-get-users.dto';
import { AuthTokenDto } from '../providers/auth0-management-api/dto/auth-token-dto';

export const authGetRolesMock: AuthGetRoles = {
  id: '12492849293',
  name: 'Hernesto capturador',
  description: 'Usuario capturador',
};

export const authGetUsersMock: AuthGetUsers[] = [
  {
    created_at: new Date(),
    email: 'juancapurador@yopmail.com',
    email_verified: true,
    identities: [
      {
        connection: 'on',
        provider: 'data',
        user_id: '12jj324had32',
        isSocial: true,
      },
    ],
    name: 'Juan capturador',
    nickname: 'Juancap96',
    picture: 'enlcace picture',
    updated_at: undefined,
    user_id: '12jj324had32',
    multifactor: [],
    multifactor_last_modified: undefined,
    last_password_reset: undefined,
    blocked: false,
    last_ip: '',
    last_login: undefined,
    logins_count: 5,
  },
];

export const authGetUsersByIdMock: AuthGetUsers = {
  created_at: new Date(),
  email: 'juancapurador@yopmail.com',
  email_verified: true,
  identities: [
    {
      connection: 'yes',
      provider: 'datas',
      user_id: '12jj324hssssad32',
      isSocial: true,
    },
  ],
  name: 'Juan capturador torrez',
  nickname: 'Juancap9602',
  picture: 'enlcace picture link',
  updated_at: undefined,
  user_id: 'a5fgjhuiyhak',
  multifactor: [],
  multifactor_last_modified: undefined,
  last_password_reset: undefined,
  blocked: false,
  last_ip: '',
  last_login: undefined,
  logins_count: 5,
};

export const tokenMock = {
  access_token: '1234567890',
  token_type: 'Bearer',
};

export const authGetRolById: AuthGetRolByIdDto = {
  user_id: 'string;',
  email: 'juancapurador@yopmail.com',
  picture: 'pictureLink',
  name: 'Juan capturador',
};
export const authTokenMock: AuthTokenDto = {
  access_token: 'a123123d13d3f',
  scope: 'data',
  expires_in: 86400,
  token_type: 'Bearer',
};

export const authGetEmailsMock: AuthGetEmailByParams[] = [
  {
    email: 'juancapurador@yopmail.com',
  },
];

export const mockedRolData = [
  {
    user_id: 'string;',
    email: 'juancapurador@yopmail.com',
    picture: 'pictureLink',
    name: 'Juan capturador',
  },
];
