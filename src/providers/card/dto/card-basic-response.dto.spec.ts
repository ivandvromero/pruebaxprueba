import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { mockCardBasic } from '../../../../test/mock-data';
import { GetCardBasicResponse } from './card-basic-response.dto';

describe('unit test card-basic-response.dto', () => {
  it('should not return error when validate GetCardBasicResponse', async () => {
    const dataResponse = mockCardBasic;
    const userResponse = plainToInstance(GetCardBasicResponse, dataResponse);
    const errors = await validate(userResponse);
    expect(errors.length).toBe(0);
  });
});
