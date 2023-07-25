import { UserInfoInterceptor } from '../get-user-info.interceptor';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

describe('AuditInterceptor', () => {
  let interceptor: UserInfoInterceptor;
  let mockConfigService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => 'auth0-audience/'),
          },
        },
      ],
      imports: [],
    }).compile();

    interceptor = new UserInfoInterceptor(mockConfigService);

    mockConfigService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create an instance of AuditInterceptor', () => {
    expect(interceptor).toBeDefined();
  });

  describe('intercept', () => {
    it('should call insertItem method of DynamodbService', () => {
      const req = {
        user: {
          email: 'test@example.com',
          name: 'Test User',
          audience: 'example',
          'auth0-audience/roles': ['role1'],
        },
      };
      const next = {
        handle: jest.fn(),
      };

      interceptor.intercept(
        { switchToHttp: () => ({ getRequest: () => req }) } as any,
        next as any,
      );

      expect(next.handle).toHaveBeenCalled();
    });
  });
});
