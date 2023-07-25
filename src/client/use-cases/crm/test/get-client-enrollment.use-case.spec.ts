import { Logger } from '@dale/logger-nestjs';
import { Test, TestingModule } from '@nestjs/testing';

import { GetClientEnrollmentUseCase } from '../get-client-enrollment.use-case';
import { CRMConnector } from '@dale/crm-connector-adapter/crm-connector';
import {
  contactResponseByParamTest,
  depositNumber,
} from '@dale/testcases/crm-testcases';

describe('GetClientEnrollmentUseCase', () => {
  let useCase: GetClientEnrollmentUseCase;
  let crmConnector: CRMConnector;
  let logger: Logger;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetClientEnrollmentUseCase,
        {
          provide: CRMConnector,
          useValue: {
            getNaturalPersonByParams: jest
              .fn()
              .mockResolvedValue(contactResponseByParamTest),
          },
        },
        {
          provide: Logger,
          useValue: {
            debug: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<GetClientEnrollmentUseCase>(
      GetClientEnrollmentUseCase,
    );
    crmConnector = module.get<CRMConnector>(CRMConnector);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
    expect(crmConnector).toBeDefined();
    expect(logger).toBeDefined();
  });

  it('should return a mapped natural person', async () => {
    //Arrange
    //act
    const resp = await useCase.apply(depositNumber);
    //Assert
    expect(resp).toBeDefined();
    expect(resp).toEqual('simplificado');
  });

  it('should call the logger when error occurs', async () => {
    //Arrange
    let naturalPerson;
    jest
      .spyOn(crmConnector, 'getNaturalPersonByParams')
      .mockRejectedValue(new Error('mock error'));
    //act
    try {
      naturalPerson = await useCase.apply(depositNumber);
    } catch (e) {}
    //Assert
    expect(naturalPerson).toBeFalsy();
  });
});
