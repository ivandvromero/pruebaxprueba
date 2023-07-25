export class SendTransactionPtsDto {
  depositNumber: string;
  amount: number;
  transactionType: string;
  transactionChannel: string;
  date?: Date;
  externalId?: string;
  fees?: number;
  vat?: number;
  gmf?: number;
}
