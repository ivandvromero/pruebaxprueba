import { DataTransformationModule } from '@dale/data-transformation-nestjs';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ServiceConfigController } from './service-config.controller';

describe('Service controller', () => {
  let testingModule: TestingModule;
  let serviceConfigController: ServiceConfigController;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          ignoreEnvFile: true,
        }),
        DataTransformationModule.forRoot({
          maskingConfig: { disableMask: false },
        }),
      ],
      controllers: [ServiceConfigController],
    }).compile();

    serviceConfigController = testingModule.get(ServiceConfigController);
  });

  describe('get configuration endpoint', () => {
    it('should return object with configuration categories', async () => {
      const res = serviceConfigController.getConfig();
      expect(res).toHaveProperty('service');
      expect(res).toHaveProperty('aws');
      expect(res).toHaveProperty('pts');
      expect(res).toHaveProperty('redis');
    });
  });
});
