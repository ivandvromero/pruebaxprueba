import { DateFormatHelper } from '../helpers';

export class CreateTransactionBodyDto {
  amount: number;
  transactionDetails: {
    transactionChannelId: string;
  };
  notes: string;
  paymentOrderId: string;
  externalId?: string;
  bookingDate: string;
  valueDate: string;
  _additionalDetails: {
    linkedTransactionId: string;
  };

  constructor(
    amount: number,
    transactionChannelId: string,
    externalId?: string,
    notes?: string,
    date?: Date,
  ) {
    const formatter = new DateFormatHelper();
    this.amount = amount;
    this.transactionDetails = { transactionChannelId: transactionChannelId };
    this.notes = notes ?? '';
    this.bookingDate = date
      ? formatter.format(date)
      : formatter.format(new Date());
    this.valueDate = date
      ? formatter.format(date)
      : formatter.format(new Date());
    this._additionalDetails = {
      linkedTransactionId: externalId ? externalId : '0000',
    };
  }
}
