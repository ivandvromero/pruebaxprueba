//Libraries
import { Test, TestingModule } from '@nestjs/testing';

//Secrets Managers
import { SecretsManager } from '../../shared/secrets-manager/secrets-manager';
import { SecretsManagerService } from '@dale/aws-nestjs';
import { Logger } from '@dale/logger-nestjs';
import { ConfigService } from '@nestjs/config';

describe('SecretsManager', () => {
  let secretsManager: SecretsManager;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SecretsManager,
        {
          provide: SecretsManagerService,
          useValue: {
            getSecretById: jest.fn(),
          },
        },
        {
          provide: Logger,
          useFactory: () => ({
            log: jest.fn(),
            error: jest.fn(),
            debug: jest.fn(),
          }),
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    secretsManager = module.get<SecretsManager>(SecretsManager);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(secretsManager).toBeDefined();
    expect(configService).toBeDefined();
  });
});
