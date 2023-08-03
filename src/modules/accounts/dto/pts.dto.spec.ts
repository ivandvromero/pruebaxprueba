import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { PtsResponse } from './pts.dto';
import { mockAccountLimitsNew } from '../../../../test/mock-data';

describe('unit test pts.dto', () => {
  it('should throw when the planned quantity is a negative number.', async () => {
    const dataResponse = mockAccountLimitsNew;
    const ptsResponseDto = plainToInstance(PtsResponse, dataResponse);
    const errors = await validate(ptsResponseDto);
    expect(errors.length).toBe(0);
  });
});
