import { ErrorCustomizer } from './customize-error';
import { CustomException } from '../shared/custom-errors/custom-exception';
import {
  mockDefaultError500,
  mockError,
  mockError400,
  mockError401,
  mockError404,
  mockError500,
  mockException,
  mockExpectedErrorObject400,
  mockExpectedErrorObject401,
  mockExpectedErrorObject404,
  mockExpectedErrorObject500,
  mockMaskedUserId,
  mockTrackingId,
  mockExceptionError,
} from '../../test/mock-data';
import { Logger } from '@dale/logger-nestjs';

describe('customizeError function', () => {
  let mockErrorLogger;
  let mockDebugLogger;
  let customizeError;

  beforeEach(() => {
    const logger = new Logger({ context: __filename });
    mockErrorLogger = logger.error = jest.fn();
    mockDebugLogger = logger.debug = jest.fn();

    const customizer = new ErrorCustomizer(logger);
    customizeError = customizer.customizeError;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should return custom exceptions and log default errors', () => {
    const receivedResponse = customizeError(mockError);
    expect(receivedResponse).toBeInstanceOf(CustomException);
    expect(receivedResponse.error).toEqual(mockExpectedErrorObject500);
    expect(mockErrorLogger).toHaveBeenCalledTimes(1);
    expect(mockErrorLogger).toHaveBeenCalledWith(
      'test-error',
      'test-error',
      undefined, // since no trackingId passed
    );
    expect(mockDebugLogger).toHaveBeenCalledTimes(0);
  });
  it('should handle CustomException errors thrown from service with masked value', () => {
    const receivedResponse = customizeError(
      mockException,
      mockMaskedUserId,
      mockTrackingId,
    );

    expect(receivedResponse.error).toEqual(mockExceptionError);
    expect(receivedResponse).toBeInstanceOf(CustomException);
    expect(mockErrorLogger).toHaveBeenCalledWith(
      `undefined for ${mockMaskedUserId}`,
      undefined,
      mockTrackingId,
    );
  });
  it('should handle CustomException errors thrown from service without masked value', () => {
    const receivedResponse = customizeError(
      mockException,
      null,
      mockTrackingId,
    );

    expect(receivedResponse.error).toEqual(mockExceptionError);
    expect(receivedResponse).toBeInstanceOf(CustomException);
    expect(mockErrorLogger).toHaveBeenCalledWith(
      undefined,
      undefined,
      mockTrackingId,
    );
  });
  it('should handle 401 Provider errors', () => {
    const receivedResponse = customizeError(
      mockError401,
      mockMaskedUserId,
      mockTrackingId,
    );

    expect(receivedResponse.error).toEqual(mockExpectedErrorObject401);
    expect(receivedResponse).toBeInstanceOf(CustomException);
    expect(mockDebugLogger).toHaveBeenCalledTimes(1);
  });
  it('should handle 400 Provider errors', () => {
    const receivedResponse = customizeError(
      mockError400,
      mockMaskedUserId,
      mockTrackingId,
    );

    expect(receivedResponse.error).toEqual(mockExpectedErrorObject400);
    expect(receivedResponse).toBeInstanceOf(CustomException);
    expect(mockDebugLogger).toHaveBeenCalledTimes(1);
  });
  it('should handle 404 Provider errors', () => {
    const receivedResponse = customizeError(
      mockError404,
      mockMaskedUserId,
      mockTrackingId,
    );

    expect(receivedResponse.error).toEqual(mockExpectedErrorObject404);
    expect(receivedResponse).toBeInstanceOf(CustomException);
    expect(mockDebugLogger).toHaveBeenCalledTimes(1);
  });
  it('should handle 500 Provider errors', () => {
    const receivedResponse = customizeError(
      mockError500,
      mockMaskedUserId,
      mockTrackingId,
    );

    expect(receivedResponse.error).toEqual(mockDefaultError500);
    expect(receivedResponse).toBeInstanceOf(CustomException);
    expect(mockDebugLogger).toHaveBeenCalledTimes(1);
  });
});
