export interface ITransaction {
  id?: string;
  clientIdentificationNumber: string;
  depositNumber: string;
  transactionType: string;
  date?: Date;
  originAccountId: string;
  parentAccountKey?: string;
  receivingAccountId: string;
  state: string;
  amount: number;
  fees: number;
  vat: number;
  gmf: number;
  total: number;
  reason?: string;
  bussinesName?: string;
}

export interface ITransactionResponse {
  headers: any;
  response: ITransaction[];
}
