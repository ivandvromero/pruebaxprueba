import {
  ICreateTransaction,
  IFilterCriteria,
  ITransaction,
  ITransactionResponse,
} from '../interfaces';

export const CoreTransactionConnector = 'CoreTransactionConnector';

export interface ICoreTransactionConnector {
  sendTransaction: (
    newTransaction: ICreateTransaction,
  ) => Promise<ITransaction>;
  getTransactionByMultipleFields: (
    fields: IFilterCriteria[],
  ) => Promise<ITransactionResponse>;
}
