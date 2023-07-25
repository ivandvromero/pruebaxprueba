export interface ITransactionChanelMambu {
  encodedKey: string;
  id: string;
  state: string;
  isDefault: boolean;
  name: string;
  loanConstraints: {
    usage: string;
    constraints: [];
    matchFiltersOption: string;
  };
  depositConstraints: {
    usage: string;
    constraints: [
      {
        criteria: string;
        operator: string;
        values: [];
      },
    ];
    matchFiltersOption: string;
  };
  availableForAll: boolean;
  usageRights: [];
}
