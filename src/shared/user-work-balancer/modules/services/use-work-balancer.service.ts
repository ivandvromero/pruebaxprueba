import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthGetEmailByParams } from 'src/shared/providers/auth0-management-api/dto/auth-get-email-by-params';
import * as crypto from 'crypto';
import { Auth0Service } from '../../../../shared/providers/auth0-management-api/auth-services/auth0-service';
import { ErrorCodesEnum } from '@dale/exceptions/code-errors/error-codes.enum';

@Injectable()
export class UseWorkBalancerService {
  constructor(readonly auth0Service: Auth0Service) {}
  async getRandomEmail(roles: string[]): Promise<AuthGetEmailByParams> {
    const emails = await this.auth0Service.getEmailByParams(roles);
    if (emails.length === 0) {
      throw new BadRequestException(
        ErrorCodesEnum.BOS026,
        'No se encontraron correos',
      );
    }
    const emailIndex = crypto.randomInt(0, emails.length);
    const randomEmail = emails[emailIndex];
    return randomEmail;
  }
}
