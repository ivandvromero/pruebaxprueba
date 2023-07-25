import { SecretsManagerService } from '@dale/aws-nestjs';
import { BadRequestException, Injectable, Optional } from '@nestjs/common';
import { Logger } from '@dale/logger-nestjs';
import { ConfigService } from '@nestjs/config';
import { decryptAES256, encryptAES256 } from '../utils/decrypt';
import { InternalServerExceptionDale } from '@dale/manage-errors-nestjs';
import { ErrorCodesEnum } from '@dale/exceptions/code-errors/error-codes.enum';

@Injectable()
export class SecretsManager {
  constructor(
    private secretManagerService: SecretsManagerService,
    private configService: ConfigService,
    @Optional() private logger?: Logger,
  ) {}

  definitionsSecretsName = [
    {
      name: 'SECRET_PATH_GENERATE_KEY_SYMMETRIC_AUDMON',
      keys: 'symmetricKey',
    },
  ];

  async cacheManagerEncrypt(dataClient: string) {
    const symmetricKey = await this.getManagerBySecretsName('symmetricKey');
    return await encryptAES256(dataClient, symmetricKey, 32);
  }
  async cacheManagerDecrypt(dataClient: string) {
    const secretValue = await this.getManagerBySecretsName('symmetricKey');
    return await decryptAES256(dataClient, secretValue);
  }

  async getManagerBySecretsName(secretsKeyName: string) {
    try {
      this.logger?.log('service get secret manager');
      const secretName = this.definitionsSecretsName.find(
        (keySecret) => keySecret.keys === secretsKeyName,
      );
      if (!secretName) {
        throw new InternalServerExceptionDale(
          ErrorCodesEnum.BOS030,
          'No se ha encontrado la secret key',
        );
      }
      const secretValue = await this.secretManagerService.getSecretById(
        this.configService.get('config.secrets.secretName'),
      );
      const secretData = JSON.parse(secretValue.SecretString);
      let response = secretData[secretsKeyName];
      const reg = new RegExp(/\\n/g);
      response = response.replace(reg, '');
      return response;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
