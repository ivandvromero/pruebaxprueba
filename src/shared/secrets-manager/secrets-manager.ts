import { SecretsManagerService } from '@dale/aws-nestjs';
import { BadRequestException, Injectable, Optional } from '@nestjs/common';
import { Logger } from '@dale/logger-nestjs';
import { ConfigService } from '@nestjs/config';
import { decryptAES256, encryptAES256 } from '../../utils/decrypt';
import { InternalServerExceptionDale } from '@dale/manage-errors-nestjs';
import { ErrorCodesEnum } from '../manage-errors/code-erros/error-codes.enum';

@Injectable()
export class SecretsManager {
  constructor(
    private secretManagerService: SecretsManagerService,
    private configService: ConfigService,
    @Optional() private logger?: Logger,
  ) {}

  definetionsSecretsName = [
    {
      name: 'SECRET_PATH_GENERATE_KEY_SYMETRIC_AUDMON',
      keys: 'symetrickey',
    },
  ];
  async cacheManagerEncrypt(dataClient: string) {
    const symetricKey = await this.getManagerBySecretsName('symetrickey');
    // Redis set
    return await encryptAES256(dataClient, symetricKey, 32);
  }
  async cacheManagerDecrypt(dataClient: string) {
    const secretValue = await this.getManagerBySecretsName('symetrickey');
    return await decryptAES256(dataClient, secretValue);
  }

  async getManagerBySecretsName(secretsKeyName: string) {
    try {
      this.logger?.log('service get secret manager');
      const secretName = this.definetionsSecretsName.find(
        (keySecret) => keySecret.keys === secretsKeyName,
      );

      if (!secretName) {
        throw new InternalServerExceptionDale(
          ErrorCodesEnum.MON000,
          'Secret Key name not found',
        );
      }
      const secretValue = await this.secretManagerService.getSecretById(
        this.configService.get<string>(secretName.name),
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
