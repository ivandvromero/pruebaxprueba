import { of } from 'rxjs';
import { AuditInterceptor } from '../audit.interceptor';

describe('AuditInterceptor', () => {
  let interceptor: AuditInterceptor;
  let mockDynamodbService: any;
  let mockLogger: any;
  let mockContext: any;
  let mockCallHandler: any;

  beforeEach(() => {
    mockDynamodbService = {
      insertItem: jest.fn(),
    };
    mockLogger = {
      error: jest.fn(),
    };
    mockContext = {
      getArgs: jest
        .fn()
        .mockReturnValue([
          { url: 'test', httpVersion: '1.1', user: { email: 'test@test.com' } },
        ]),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest
          .fn()
          .mockReturnValue({ headers: { 'X-Forwarded-For': '127.0.0.1' } }),
      }),
    };
    mockCallHandler = {
      handle: jest.fn().mockReturnValue(of({})),
    };
    interceptor = new AuditInterceptor(mockDynamodbService, mockLogger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create an instance of AuditInterceptor', () => {
    expect(interceptor).toBeDefined();
  });

  describe('intercept', () => {
    it('should call insertItem method of DynamodbService', async () => {
      (await interceptor.intercept(mockContext, mockCallHandler)).toPromise();

      expect(mockDynamodbService.insertItem).toHaveBeenCalled();
    });

    it('should log error if insertItem method of DynamodbService throws an error', async () => {
      mockDynamodbService.insertItem.mockRejectedValue(new Error('test error'));

      (await interceptor.intercept(mockContext, mockCallHandler)).toPromise();

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Error creating audit service test error',
      );
    });
  });
});
