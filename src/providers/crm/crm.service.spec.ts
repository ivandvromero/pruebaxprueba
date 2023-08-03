import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ErrorCustomizer } from '../../utils/customize-error';
import { Logger } from '@dale/logger-nestjs';
import { ServiceCRM } from './crm.service';

describe('ServiceCRM', () => {
  let service: ServiceCRM;
  let spyHttpService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceCRM,
        {
          provide: Logger,
          useFactory: () => ({
            log: jest.fn(),
            error: jest.fn(),
            debug: jest.fn(),
          }),
        },
        ErrorCustomizer,
      ],
    }).compile();
    service = module.get<ServiceCRM>(ServiceCRM);
    spyHttpService = module.get(HttpService);
  });

  /* describe('generateToken', () => {
    it('generateToken - Success', async () => {
      const response = await service.consultElectronicDeposit('2242');
      expect(response).toBeDefined(),
    });
  }); */
});
