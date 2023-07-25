import { IAccount } from '../interfaces/account.interface';
import { IClient } from '../interfaces/client.interface';
import { IFilterCriteria } from '../interfaces/field-criteria.interface';
import { ITransactionChanel } from '../interfaces/transaction-chanel.interface';
import { IUserBehavior } from '../interfaces/user-behavior.interface';

export const CoreQueryConnector = 'CoreQueryConnector';

export interface ICoreQueryConnector {
  roleBehavior: IUserBehavior;
  getClientById: (clientId: string) => Promise<IClient>;
  getClientByIdentificationNumber(identification: string): Promise<IClient>;
  getClientByMultipleFields: (fields: IFilterCriteria[]) => Promise<IClient>;
  getAccountById(accountId: string): Promise<IAccount>;
  getAccountByClientId(clientId: string): Promise<IAccount>;
  getTransactionChanels: () => Promise<ITransactionChanel[]>;
}
