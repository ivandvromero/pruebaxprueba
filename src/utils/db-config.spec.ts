import * as AWS from 'aws-sdk';
import * as db from './db-config';
import { getAWSToken, getDbConfig } from './db-config';

describe('the db config service', () => {
  it('getAWSToken', async () => {
    const signer = {
      getAuthToken: (obj: any, fn: any) => {
        fn(null, '');
      },
    };
    const result = await getAWSToken(signer);
    expect(result).toEqual('');
  });
  it('getAWSToken Error', async () => {
    const signer = {
      getAuthToken: (obj: any, fn: any) => {
        fn({}, null);
      },
    };
    try {
      await getAWSToken(signer);
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
  it('getDbConfig no env variable', async () => {
    const result = await getDbConfig('');
    expect(result).toEqual({});
  });
  it('getDbConfig env variable', async () => {
    process.env.CLOUD_SERVICE_PROVIDER = 'AWS';
    jest
      .spyOn(AWS.RDS, 'Signer')
      .mockImplementation(() => ({ getAuthToken: null }));
    jest.spyOn(db, 'getAWSToken').mockImplementation(async () => {
      return '';
    });
    const result = await getDbConfig('');
    expect(result).toBeDefined();
  });
});
