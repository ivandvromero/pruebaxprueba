import { TransactionType } from './create-transaction.dto';
import { ICreateTransaction } from '../../common/interfaces/create-transaction.interface';

export class SendTransactionDto implements ICreateTransaction {
  depositNumber: string;

  amount: number;

  transactionType: TransactionType;

  transactionChannel: string;

  externalId?: string;

  date?: Date;
}
