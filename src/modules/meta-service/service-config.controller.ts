import { MaskingService } from '@dale/data-transformation-nestjs';
import { Controller, Get, HttpCode } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConditionalAuditCreator } from '@dale/shared-nestjs/utils/audit/audit-creator';
import { ActorType } from '@dale/shared-nestjs/utils/audit/types';
import { getProviderMaskingConfig } from '../../utils/common';
import { functionalities } from '../../constants/common';
@ConditionalAuditCreator({
  executionContext: {
    functionality: functionalities.SERVICE_CONFIGURATION,
    actorType: ActorType.DEVELOPER,
  },
  requestMap: {
    'headers.authorization': 'actorId',
  },
  outputMap: {},
})
@Controller()
export class ServiceConfigController {
  constructor(
    private configService: ConfigService,
    private maskingService: MaskingService,
  ) {}

  @Get('service/config')
  @HttpCode(200)
  getConfig() {
    return this.maskingService.maskObject(
      {
        service: this.configService.get('service'),
        aws: this.configService.get('aws'),
        pts: this.configService.get('pts'),
        redis: this.configService.get('redis'),
      },
      getProviderMaskingConfig(),
    );
  }
}
