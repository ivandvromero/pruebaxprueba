import { UserDto } from './enrollment.dto';

describe('UserDto', () => {
  it('should be defined', () => {
    expect(new UserDto()).toBeDefined();
  });
});
