export class AuthGetUsers {
  created_at: Date;
  email: string;
  email_verified: boolean;
  identities: [
    {
      connection: string;
      provider: string;
      user_id: string;
      isSocial: boolean;
    },
  ];
  name: string;
  nickname: string;
  picture: string;
  updated_at: string;
  user_id: string;
  multifactor: [];
  multifactor_last_modified: Date;
  last_password_reset: Date;
  blocked?: boolean;
  last_ip: string;
  last_login: Date;
  logins_count: number;
}
