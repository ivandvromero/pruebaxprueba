export class AccountCreateRequest {
  headerRQ: {
    msgId: string;
  };
  securityRQ: any;
  messageRQ: {
    digitalService: string;
    currency: string;
    bankId: string;
    customerExternalId: string;
    account: {
      legacyId: any;
      othersId: [
        {
          identificationType: string;
          identificationId: string;
        },
      ];
    };
    additionals: {
      client_type: string;
    };
    status: string;
    thirdPartyAdditionalsBPA: {
      internalControls: {
        maxDepositBalance: number;
      };
    };
  };
}

export class AccountCreateResponse {
  headerRS: {
    msgId: string;
    msgIdOrg: string;
    timestamp: string;
  };
  statusRS: {
    code: string;
    description: string;
  };
  messageRS: {
    ThirdPartyData: {
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
      overdraftInterestSettings: any;
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
    };
    internalAccountId: string;
    currency: string;
    bankId: string;
    country: string;
    legacy: {
      legacyAccountNumber: string;
      legacyAccountType: string;
      legacyBranchId: string;
    };
    othersId: {
      DALE: string;
      MAMBU: string;
    };
  };
}

export class AccountModifyLimitsRequest {
  headerRQ: {
    msgId: string;
    timestamp: string;
  };
  securityRQ: {
    hostId: string;
    channelId: string;
  };
  messageRQ: {
    currency: string;
    dailyAmountLimit: string;
    weeklyAmountLimit: string;
    dailyVolumeLimit: string;
    weeklyVolumeLimit: string;
    monthlyAmountLimit: string;
    annualAmountLimit: string;
    monthlyVolumeLimit: string;
    annualVolumeLimit: string;
    accumulatorId: string;
    channelId: string;
    bdSegmentId: string;
    productId: string;
    digitalServiceId: string;
    operationId: string;
    instanceId: string;
    identificationType: string;
    identificationId: string;
    serviceId: string;
  };
}

export class Accumulators {
  code: string;
  idOption: string;
  nameOption: string;
  description: string;
  availableModifications: number;
}
export class AccountModifyLimitsResponse {
  accountId: string;
  accumulators: Accumulators[];
}
