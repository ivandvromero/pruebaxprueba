import { UpdateCustomerDepositDto } from './customer-deposit.dto';

describe('UpdateCustomerDepositDto', () => {
  it('UpdateCustomerDepositDto Success', async () => {
    const dto = new UpdateCustomerDepositDto();
    expect(dto).toBeDefined();
  });
});
