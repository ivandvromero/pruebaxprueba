import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { configurationGetUserByAccountNumberResponseDecrypt } from '../../../../test/mock-data';
import { GetUserResponse } from './user-response.dto';

describe('unit test user-response.dto', () => {
  it('should not return error when validate GetUserResponse', async () => {
    const dataResponse = configurationGetUserByAccountNumberResponseDecrypt;
    const userResponse = plainToInstance(GetUserResponse, dataResponse);
    const errors = await validate(userResponse);
    expect(errors.length).toBe(0);
  });
});
