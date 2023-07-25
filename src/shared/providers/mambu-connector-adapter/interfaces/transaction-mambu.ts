export interface TransactionMambu {
  encodedKey: string;
  id: string;
  externalId?: string;
  paymentOrderId?: string;
  creationDate: Date;
  valueDate: Date;
  bookingDate: Date;
  notes: string;
  parentAccountKey: string;
  type: string;
  amount: number;
  currencyCode: string;
  affectedAmounts: {
    fundsAmount: number;
    interestAmount: number;
    feesAmount: number;
    overdraftAmount: number;
    overdraftFeesAmount: number;
    overdraftInterestAmount: number;
    technicalOverdraftAmount: number;
    technicalOverdraftInterestAmount: number;
    fractionAmount: number;
  };
  taxes: any;
  accountBalances: {
    totalBalance: number;
  };
  userKey: string;
  terms: {
    interestSettings: any;
    overdraftInterestSettings: any;
    overdraftSettings: any;
  };
  transactionDetails: {
    transactionChannelKey: string;
    transactionChannelId: string;
  };
  transferDetails: any;
  fees: [];
  _additionalDetails: {
    cus: string;
    ipAddress: string;
    linkedTransactionId: string;
  };
}
