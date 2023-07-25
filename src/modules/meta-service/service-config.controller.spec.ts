import { DataTransformationModule } from '@dale/data-transformation-nestjs';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import configuration from '../../config/service-configuration';
import { ServiceConfigController } from './service-config.controller';

describe('Service controller', () => {
  let testingModule: TestingModule;
  let serviceConfigController: ServiceConfigController;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          ignoreEnvFile: true,
          load: [configuration],
        }),
        DataTransformationModule.forRoot({
          maskingConfig: { disableMask: false },
        }),
      ],
      controllers: [ServiceConfigController],
    }).compile();

    serviceConfigController = testingModule.get<ServiceConfigController>(
      ServiceConfigController,
    );
  });

  describe('get configuration endpoint', () => {
    it('should return object with configuration categories', async () => {
      const res = serviceConfigController.getConfig();
      expect(res).toHaveProperty('service');
      expect(res).toHaveProperty('kafka');
      expect(res).toHaveProperty('redis');
      expect(res).toHaveProperty('crm');
    });
  });
});
