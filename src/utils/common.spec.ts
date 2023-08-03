import { getProviderMaskingConfig } from './common';
import { maskingConfig } from '../config/service-configuration';

describe('getProviderMaskingConfig function', () => {
  it('should return an array of error objects with reason and source', () => {
    const receivedResponse = getProviderMaskingConfig();
    expect(receivedResponse).toEqual(maskingConfig);
  });
});
