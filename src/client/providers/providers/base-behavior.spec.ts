import { BaseBehavior } from './base-behavior';
import { clientDto } from '../../../shared/testcases/client-testcases';
import { IClient } from '../../common/interfaces';

describe('BaseBehavior', () => {
  const baseBehavior: BaseBehavior = new BaseBehavior();

  test('should map a client', () => {
    //arrange
    const oldClient = clientDto;
    //act
    const mappedClient: IClient = baseBehavior.mapClient(oldClient);

    //assert
    expect(mappedClient).toBeDefined();
    expect(typeof mappedClient.client.clientId).toBe('string');
    expect(typeof mappedClient.client.depositNumber).toBe('string');
    expect(typeof mappedClient.client.email).toBe('string');
    expect(typeof mappedClient.client.phoneNumber).toBe('string');
    expect(typeof mappedClient.client.identificationNumber).toBe('string');
  });
});
