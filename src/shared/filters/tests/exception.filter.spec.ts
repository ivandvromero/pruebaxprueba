// all-exception.filter.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { Logger } from '@dale/logger-nestjs';
import {
  BadRequestExceptionFilter,
  CustomExceptionFilter,
  NotFoundExceptionFilter,
  GlobalExceptionFilter,
  UnauthorizedExceptionFilter,
} from '..';
import {
  mockDefaultException,
  mockError,
  mockError400,
  mockError404,
  mockErrors404,
  mockTrackingId,
  mockUnauthorizedError401,
} from './mock-data';
import {
  ErrorCodes,
  ErrorMessage,
} from '../../../shared/constants/system-errors';
const mockAppLoggerService = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
};
const mockJson = jest.fn();
const mockStatus = jest.fn().mockImplementation(() => ({
  json: mockJson,
}));
const mockGetResponse = jest.fn().mockImplementation(() => ({
  status: mockStatus,
}));
const mockGetRequest = jest.fn().mockImplementation(() => ({
  body: {
    trackingId: mockTrackingId,
  },
  method: 'PUT',
}));
const mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
  getResponse: mockGetResponse,
  getRequest: mockGetRequest,
}));

const mockArgumentsHost = {
  switchToHttp: mockHttpArgumentsHost,
  getArgByIndex: jest.fn(),
  getArgs: jest.fn(),
  getType: jest.fn(),
  switchToRpc: jest.fn(),
  switchToWs: jest.fn(),
};

describe('Exception filters', () => {
  let service: GlobalExceptionFilter;
  let notFoundService: NotFoundExceptionFilter;
  let customExceptionService: CustomExceptionFilter;
  let badRequestExceptionService: BadRequestExceptionFilter;
  let unauthorizedExceptionService: UnauthorizedExceptionFilter;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: Logger,
          useValue: mockAppLoggerService,
        },
        GlobalExceptionFilter,
        NotFoundExceptionFilter,
        CustomExceptionFilter,
        BadRequestExceptionFilter,
        UnauthorizedExceptionFilter,
      ],
    }).compile();
    service = module.get<GlobalExceptionFilter>(GlobalExceptionFilter);
    notFoundService = module.get<NotFoundExceptionFilter>(
      NotFoundExceptionFilter,
    );
    customExceptionService = module.get<CustomExceptionFilter>(
      CustomExceptionFilter,
    );
    badRequestExceptionService = module.get<BadRequestExceptionFilter>(
      BadRequestExceptionFilter,
    );
    unauthorizedExceptionService = module.get<UnauthorizedExceptionFilter>(
      UnauthorizedExceptionFilter,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should log error and send back internal server error in case of default errors', () => {
    service.catch(mockError, mockArgumentsHost);
    expect(mockStatus).toBeCalledTimes(1);
    expect(mockStatus).toBeCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockJson).toBeCalledTimes(1);
    expect(mockJson).toBeCalledWith(undefined);
    expect(mockAppLoggerService.error).toHaveBeenCalledTimes(1);
  });

  it('should log error and send back internal server error in case of default errors and get trackingId from request.query', () => {
    mockGetRequest.mockImplementationOnce(() => ({
      query: {
        trackingId: mockTrackingId,
      },
      method: 'GET',
    }));
    service.catch(mockError, mockArgumentsHost);
    expect(mockStatus).toBeCalledTimes(1);
    expect(mockStatus).toBeCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockJson).toBeCalledTimes(1);
    expect(mockJson).toBeCalledWith(undefined);
    expect(mockAppLoggerService.error).toHaveBeenCalledTimes(1);
  });

  it('should handle route not found errors', () => {
    notFoundService.catch(mockError404, mockArgumentsHost);

    expect(mockStatus).toBeCalledTimes(1);
    expect(mockStatus).toBeCalledWith(HttpStatus.NOT_FOUND);
    expect(mockJson).toBeCalledTimes(1);
    expect(mockJson).toBeCalledWith({
      errors: mockErrors404,
    });
    expect(mockAppLoggerService.error).toHaveBeenCalledTimes(1);
  });

  it('should handle route not found errors and get trackingId from request.query', () => {
    mockGetRequest.mockImplementationOnce(() => ({
      query: {
        trackingId: mockTrackingId,
      },
      method: 'GET',
    }));

    notFoundService.catch(mockError404, mockArgumentsHost);
    expect(mockStatus).toBeCalledTimes(1);
    expect(mockStatus).toBeCalledWith(HttpStatus.NOT_FOUND);
    expect(mockJson).toBeCalledTimes(1);
    expect(mockJson).toBeCalledWith({
      errors: mockErrors404,
    });
    expect(mockAppLoggerService.error).toHaveBeenCalledTimes(1);
  });

  it('should handle validation errors', () => {
    badRequestExceptionService.catch(mockError400, mockArgumentsHost);
    expect(mockStatus).toBeCalledTimes(1);
    expect(mockStatus).toBeCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockJson).toBeCalledTimes(1);
    expect(mockJson).toBeCalledWith(['{"code": 2000, "message":"test_error"}']);
    expect(mockAppLoggerService.error).toHaveBeenCalledTimes(1);
    expect(mockAppLoggerService.error).toHaveBeenCalledWith(
      ErrorMessage.INVALID_PAYLOAD_ERROR,
      ['{"code": ' + ErrorCodes.DEFAULT_CODE + ', "message":"test_error"}'],
      mockTrackingId,
    );
  });

  it('should handle validation errors string message', () => {
    const mockErrorWithStringMessage = {
      response: {
        message:
          '{"code": ' + ErrorCodes.DEFAULT_CODE + ', "message":"test_error"}',
      },
    };
    badRequestExceptionService.catch(
      mockErrorWithStringMessage,
      mockArgumentsHost,
    );
    expect(mockStatus).toBeCalledTimes(1);
    expect(mockStatus).toBeCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockJson).toBeCalledTimes(1);
    expect(mockJson).toBeCalledWith(['{"code": 2000, "message":"test_error"}']);
    expect(mockAppLoggerService.error).toHaveBeenCalledTimes(1);
    expect(mockAppLoggerService.error).toHaveBeenCalledWith(
      ErrorMessage.INVALID_PAYLOAD_ERROR,
      '{"code": ' + ErrorCodes.DEFAULT_CODE + ', "message":"test_error"}',
      mockTrackingId,
    );
  });

  it('should send back CustomException errors', () => {
    customExceptionService.catch(mockDefaultException, mockArgumentsHost);
    expect(mockStatus).toBeCalledTimes(1);
    expect(mockStatus).toBeCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockJson).toBeCalledTimes(1);
    expect(mockJson).toBeCalledWith(mockDefaultException);
    expect(mockAppLoggerService.error).toHaveBeenCalledTimes(0);
  });

  it('should handle unauthorized exception errors', () => {
    unauthorizedExceptionService.catch(
      mockUnauthorizedError401,
      mockArgumentsHost,
    );

    expect(mockStatus).toBeCalledTimes(1);
    expect(mockStatus).toBeCalledWith(HttpStatus.UNAUTHORIZED);
    expect(mockJson).toBeCalledTimes(1);
    expect(mockJson).toBeCalledWith({
      code: ErrorCodes.INTERNAL_SERVER_ERROR_CODE,
      message: ErrorMessage.INTERNAL_SERVER_REASON,
    });
    expect(mockAppLoggerService.error).toHaveBeenCalledTimes(1);
  });
});
