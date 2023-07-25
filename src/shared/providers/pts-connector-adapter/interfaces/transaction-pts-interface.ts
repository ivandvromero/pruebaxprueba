export interface TransactionPts {
  messageRS: {
    postingId: string;
    responseType: string;
    confirmationNumber: string;
    data: {
      transactionDetails: {
        transactionChannelKey: string;
        transactionChannelId: string;
      };
    };
    amount: number;
    fees: [];
    notes: string;
    affectedAmounts: {
      feesAmount: number;
      overdraftInterestAmount: number;
      overdraftFeesAmount: number;
      fractionAmount: number;
      technicalOverdraftAmount: number;
      overdraftAmount: number;
      interestAmount: number;
      technicalOverdraftInterestAmount: number;
      fundsAmount: number;
    };
    _additionalDetails: {
      linkedTransactionId: string;
    };
    taxes: any;
    valueDate: string;
    creationDate: string;
    type: string;
    userKey: string;
    parentAccountKey: string;
    accountBalances: {
      totalBalance: number;
    };
    terms: {
      interestSettings: any;
      overdraftSettings: object;
      overdraftInterestSettings: object;
    };
    transferDetails: any;
    paymentOrderId: string;
    encodedKey: string;
    bookingDate: string;
    id: string;
    currencyCode: string;
  };
  errorCode: string;
  operation: string;
  roundId: string;
  ordinal: string;
}
