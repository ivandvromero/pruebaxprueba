import { MaskingService } from '@dale/data-transformation-nestjs';
import { Controller, Get, HttpCode } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConditionalAuditCreator } from '@dale/shared-nestjs/utils/audit/audit-creator';
import { ActorType } from '@dale/shared-nestjs/utils/audit/types';
import { maskingConfig } from '../../config/service-configuration';
import { functionalities } from '../../constants/common';

@ConditionalAuditCreator({
  executionContext: {
    functionality: functionalities.SERVICE_CONFIGURATION,
    actorType: ActorType.USER,
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
        kafka: this.configService.get('kafka'),
        redis: this.configService.get('redis'),
        crm: this.configService.get('crm'),
      },
      maskingConfig,
    );
  }
}
