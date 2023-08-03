// general schema for account details
export const accountDetailsSchema = {
  id: 'accountNumber',
  accountState: 'accountState',
  accountType: 'accountType',
  encodedKey: 'accountId',
  'balances.availableBalance': 'availableBalance',
  currencyCode: 'currencyCode',
};

// response schema for when account details are retrieved by accountId
export const accountDetailsByAccountIdResponseSchema = {
  ...accountDetailsSchema,
  accountHolderKey: 'clientId',
};
