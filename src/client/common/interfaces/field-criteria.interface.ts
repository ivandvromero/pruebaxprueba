export interface IFilterCriteria {
  field: string;
  value: string;
  secondValue?: string;
}

export interface IFilterCriteriaFindTransactions {
  depositNumber?: string;
  identification?: string;
  receivingAccountId?: string;
  originAccountId?: string;
  phone?: string;
  transactionType?: string;
  idTransactionNumber?: string;
  referenceNumber?: string;
  initialDate: Date;
  endDate: Date;
  amount?: string;
  status?: string;
  reason?: string;
}
