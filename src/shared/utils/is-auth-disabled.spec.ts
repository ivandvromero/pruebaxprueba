import { isAuthDisabled } from './auth.disabled';
export const mockDisableAuth = 'true';
export const mockEnableAuth = 'false';

describe('isAuthDisabled function', () => {
  const OLD_ENV = process.env;
  beforeEach(() => {
    process.env = { ...OLD_ENV };
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it('should return true if DISABLE_AUTH is true', () => {
    process.env.DISABLE_AUTH = mockDisableAuth;
    const res = isAuthDisabled();
    expect(res).toEqual(true);
  });

  it('should return false if DISABLE_AUTH is not true', () => {
    process.env.DISABLE_AUTH = mockEnableAuth;
    const res = isAuthDisabled();
    expect(res).toEqual(false);
  });

  it('should return false if DISABLE_AUTH is not set', () => {
    process.env.DISABLE_AUTH = undefined;
    const res = isAuthDisabled();
    expect(res).toEqual(false);
  });
});
