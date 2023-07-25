import { TokenValidationResponse } from '@dale/notifications/shared/interfaces/decoded-token.interface';
import { Optional } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'typeorm';
import * as jwksClient from 'jwks-rsa';
import {
  JwtHeader,
  SigningKeyCallback,
  verify,
  VerifyErrors,
  VerifyOptions,
} from 'jsonwebtoken';

export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    @Optional() private logger: Logger,
  ) {}
  async valiDateToken(token: string): Promise<TokenValidationResponse> {
    const clientJwks = jwksClient({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `${this.configService.get(
        'config.auth.url',
      )}/.well-known/jwks.json`,
    });

    const options: VerifyOptions = { algorithms: ['RS256'] };
    const getKey = (header: JwtHeader, callback: SigningKeyCallback) => {
      clientJwks.getSigningKey(header.kid, (err, key) => {
        const signingKey = key?.getPublicKey();
        callback(err, signingKey);
      });
    };

    return new Promise<TokenValidationResponse>((resolve) => {
      verify(token, getKey, options, (err: VerifyErrors, decoded: any) => {
        if (err) resolve({ authorized: false, tokenDecoded: decoded });
        resolve({ authorized: true, tokenDecoded: decoded });
      });
    });
  }
}
