export interface IFindTransactionPtsResponse {
  othersCosts: number;
  transactionAmount: number;
  total: number;
  transactionName: string;
  channel: string;
  transactionDateTime: Date;
  referenceNumber: string;
  sourceProduct: any;
  identificationNumber: string;
  targetProduct?: {
    beneficiaryBankId?: string;
    beneficiaryAccount: string;
  };
  type: string;
  amounts: Amounts[];
  reason: string;
  status: string;
}

export interface Amounts {
  amount: number;
  currency: string;
  operation: string;
  valueDate: string;
  ordinal: string;
}

export interface TransactionOptions {
  identification: string;
  depositNumber: string;
  phone: string;
  originAccountId: any;
  receivingAccountId: any;
  amount: string;
  transactionType: string;
  idTransactionNumber: string;
  initialDate: Date;
  endDate: Date;
  status: string;
}
