import { mapAccountProviderErrors } from './map-account-provider-errors';
import { mockExpectedErrorObject, mockErrors } from '../../test/mock-data';

describe('mapAccountProviderErrors function', () => {
  it('should return an array of error objects with reason and source', () => {
    const receivedResponse = mapAccountProviderErrors(mockErrors);
    expect(receivedResponse).toEqual(mockExpectedErrorObject);
  });
});
