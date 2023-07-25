export interface IAccountMambu {
  encodedKey: string;
  creationDate: string;
  lastModifiedDate: string;
  id: string;
  name: string;
  accountHolderType: string;
  accountHolderKey: string;
  accountState: string;
  productTypeKey: string;
  accountType: string;
  approvedDate: string;
  activationDate: string;
  lastAccountAppraisalDate: string;
  currencyCode: string;
  internalControls: {
    maxDepositBalance: number;
  };
  overdraftSettings: {
    allowOverdraft: boolean;
    overdraftLimit: number;
  };
  interestSettings: {
    interestPaymentSettings: {
      interestPaymentDates: [];
    };
  };
  balances: {
    totalBalance: number;
    overdraftAmount: number;
    technicalOverdraftAmount: number;
    lockedBalance: number;
    availableBalance: number;
    holdBalance: number;
    overdraftInterestDue: number;
    technicalOverdraftInterestDue: number;
    feesDue: number;
    blockedBalance: number;
    forwardAvailableBalance: number;
  };
  accruedAmounts: {
    interestAccrued: number;
    overdraftInterestAccrued: number;
    technicalOverdraftInterestAccrued: number;
    negativeInterestAccrued: number;
  };
}
