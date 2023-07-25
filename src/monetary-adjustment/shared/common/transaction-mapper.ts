import {
  CreateTransactionDto,
  TransactionType,
} from '@dale/client/modules/dto';
import { MonetaryAdjustmentEntity } from '../interfaces/monetary-adjustment.entity';

export class TransactionMapper implements CreateTransactionDto {
  depositNumber: string;
  amount: number;
  transactionType: TransactionType;
  transactionChannel: string;
  date: Date;
  externalId?: string;
  fees: number;
  vat: number;
  gmf: number;

  constructor(adjustment: MonetaryAdjustmentEntity) {
    const {
      depositNumber,
      amount,
      adjustmentType,
      transactionCode,
      fees,
      vat,
      gmf,
    } = adjustment;

    this.depositNumber = depositNumber;
    this.amount = amount;
    this.transactionType = adjustmentType;
    this.transactionChannel = transactionCode;
    this.fees = fees;
    this.vat = vat;
    this.gmf = gmf;
  }
}
