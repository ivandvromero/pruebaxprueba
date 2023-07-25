import { Test, TestingModule } from '@nestjs/testing';

import { Logger } from '@dale/logger-nestjs';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: Logger,
          useValue: {
            debug: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => 'apiConfigMonetaryAdjustment'),
          },
        },
        {
          provide: Logger,
          useValue: {
            debug: jest.fn(),
            log: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('Should be Controller defined', () => {
    expect(service).toBeDefined();
  });
});
