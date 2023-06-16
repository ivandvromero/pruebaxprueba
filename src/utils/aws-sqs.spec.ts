import { sendMessage } from './aws-sqs';
import * as AWS from 'aws-sdk';
import { InternalServerExceptionDale } from '@dale/manage-errors-nestjs';

describe('Test case for SQS SendMessage', () => {
  // Arrange
  const expected = {
    ResponseMetadata: {
      RequestId: '01',
    },
    MD5OfMessageBody: 'test',
    MessageId: '02',
  };
  const mockData = {
    ResponseMetadata: {
      RequestId: '01',
    },
    MD5OfMessageBody: 'test',
    MessageId: '02',
  };
  const mockMessageAttributes = {
    Title: { DataType: 'test1', StringValue: 'test1' },
    Author: { DataType: 'test2', StringValue: 'test2' },
    WeeksOn: { DataType: 'test3', StringValue: 'test3' },
  };
  it('should return the UserEvent', async () => {
    // Arrange
    const stubSendMessage = jest.fn().mockReturnValueOnce(mockData);
    jest.spyOn(AWS, 'SQS').mockReturnValueOnce({
      sendMessage: stubSendMessage,
    } as any as AWS.SQS);

    // Act
    const result = sendMessage({ MessageBody: 'test' });

    // Assert
    expect(result).resolves.toEqual(expected);
    expect(stubSendMessage).toHaveBeenCalled();
  });
  it('should return the UserEvent', async () => {
    // Arrange
    const stubSendMessage = jest.fn().mockReturnValueOnce(mockData);
    jest.spyOn(AWS, 'SQS').mockReturnValueOnce({
      sendMessage: stubSendMessage,
    } as any as AWS.SQS);
    // Act
    const result = sendMessage({
      MessageBody: 'test',
      MessageAttributes: mockMessageAttributes,
      DelaySeconds: 0,
    });
    expect(result).resolves.toEqual(expected);
    expect(stubSendMessage).toHaveBeenCalled();
  });

  it('should throw an error when send message error', async () => {
    // Arrange
    const sendMessageErrorMessage = 'network error';
    const stubSendMessage = jest
      .fn()
      .mockRejectedValueOnce(sendMessageErrorMessage);
    jest.spyOn(AWS, 'SQS').mockReturnValueOnce({
      sendMessage: stubSendMessage,
    } as any as AWS.SQS);

    // Act
    await expect(sendMessage({ MessageBody: 'test' })).rejects.toThrowError(
      InternalServerExceptionDale,
    );
  });
});
