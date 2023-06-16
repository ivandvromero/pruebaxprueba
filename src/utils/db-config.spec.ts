import * as dbConfig from './db-config';
import { getAWSToken, getDbConfig } from './db-config';

const getAWSTokenMock = jest
  .spyOn(dbConfig, 'getAWSToken')
  .mockReturnValue(Promise.resolve(''));

const getDbConfigMock = jest
  .spyOn(dbConfig, 'getDbConfig')
  .mockReturnValue(null);

describe('the db config service', () => {
  it('getAWSToken', async () => {
    const result = await getAWSToken('');
    expect(getAWSTokenMock).toHaveBeenCalled();
    expect(getAWSTokenMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual('');
  });
  it('getDbConfig', async () => {
    const result = await getDbConfig('');
    expect(getDbConfigMock).toHaveBeenCalled();
    expect(getDbConfigMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual(null);
  });
});
