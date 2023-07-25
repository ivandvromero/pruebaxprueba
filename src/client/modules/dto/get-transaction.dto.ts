import { ITransaction } from '../../common/interfaces/transaction.interface';

export class GetTransactionDto implements ITransaction {
  id: string;
  clientIdentificationNumber: string;
  depositNumber: string;
  transactionType: string;
  date: Date;
  originAccountId: string;
  receivingAccountId: string;
  state: string;
  amount: number;
  fees: number;
  vat: number;
  gmf: number;
  total: number;
}
