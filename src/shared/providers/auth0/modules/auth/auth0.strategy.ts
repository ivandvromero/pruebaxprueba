import { Injectable } from '@nestjs/common';
import { passportJwtSecret } from 'jwks-rsa';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Auth0Strategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${configService.get(
          'config.auth.url',
        )}/.well-known/jwks.json`,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: `${configService.get('config.auth.audience')}`,
      issuer: `${configService.get('config.auth.url')}/`,
      algorithms: ['RS256'],
    });
  }

  async validate(jwtPayload: any): Promise<any> {
    return jwtPayload;
  }
}
