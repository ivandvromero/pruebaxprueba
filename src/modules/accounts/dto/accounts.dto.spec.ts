import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { AccountDetailsByAccountIdDto, CreateAccountDto } from './accounts.dto';
import {
  mockAccountId,
  mockCreateAccountData,
} from '../../../../test/mock-data';

describe('unit test accounts.dto', () => {
  it('should not return error when validate mockCreateAccountData', async () => {
    const dataResponse = mockCreateAccountData;
    delete dataResponse.user.dob;
    const createAccountData = plainToInstance(CreateAccountDto, dataResponse);
    const errors = await validate(createAccountData);
    expect(errors.length).toBe(0);
  });

  it('should not return error when validate AccountDetailsByAccountIdDto', async () => {
    const data = {
      accountId: mockAccountId,
    };
    const createAccountData = plainToInstance(
      AccountDetailsByAccountIdDto,
      data,
    );
    const errors = await validate(createAccountData);
    expect(errors.length).toBe(0);
  });

  it('should return error validate AccountDetailsByAccountIdDto: when accountId isEmpty', async () => {
    const data = {
      accountId: '',
    };
    const createAccountData = plainToInstance(
      AccountDetailsByAccountIdDto,
      data,
    );
    const errors = await validate(createAccountData);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });
});
