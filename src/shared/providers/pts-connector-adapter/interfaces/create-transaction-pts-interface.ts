export interface InterfaceCreateTransaction {
  depositNumber: string;
  amount: number;
  transactionType: string;
  transactionChannel: string;
  externalId?: string;
  fees?: number;
  vat?: number;
  gmf?: number;
}
