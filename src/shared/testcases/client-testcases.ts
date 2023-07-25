import {
  CreateTransactionDto,
  TransactionQuery,
  TransactionType,
} from '@dale/client/modules/dto';
import {
  IAccount,
  IClient,
  ICreateTransaction,
  IFilterCriteria,
  IFilterCriteriaFindTransactions,
  ITransaction,
  ITransactionChanel,
} from '@dale/client/common/interfaces';
import { TransactionQueryQuantity } from '@dale/client/modules/dto/transaction-query-quantity.dto';
import {
  ClientMambu,
  ITransactionChanelMambu,
  IAccountMambu,
  TransactionMambu,
} from '@dale/mambu-connector-adapter/interfaces';
import { CreateTransactionPtsDto } from '@dale/pts-connector/dto/create-transaction-pts.dto';
import { SendTransactionPtsDto } from '@dale/pts-connector/dto/send-transaction-pts.dto';
import { InterfaceCreateTransaction } from '@dale/pts-connector/interfaces/create-transaction-pts-interface';
import { TransactionPts } from '@dale/pts-connector/interfaces/transaction-pts-interface';
import { IFindTransactionPtsResponse } from '@dale/pts-connector/interfaces/find-transactions-pts-response.interface';
import { PaginationNewTransactionResponse } from '@dale/client/common/interfaces/get-transactions-response';

export const clientDto: IClient = {
  client: {
    clientId: '987654321',
    depositNumber: '',
    email: 'mock@mail.com',
    firstName: 'Pedro',
    lastName: 'Perez',
    phoneNumber: '3216545987',
    identificationNumber: '123456789',
    identificationType: 'Cedula',
  },
  encodeKey: '987654321',
};

export const clientDtoEnrollment: IClient = JSON.parse(
  JSON.stringify(clientDto),
);

clientDtoEnrollment.client.enrollment = 'simplificado';

export const mockTransactionPts: InterfaceCreateTransaction = {
  depositNumber: '',
  amount: 0,
  transactionType: '',
  transactionChannel: '',
  fees: 0,
  vat: 0,
  gmf: 0,
};
export const createTransactionPts: CreateTransactionPtsDto = {
  depositNumber: '',
  amount: 123,
  transactionType: '',
  transactionChannel: '',
  fees: 1,
  vat: 1,
  gmf: 1,
};
export const mockSendTransactionPtsDto: SendTransactionPtsDto = {
  depositNumber: '2000007',
  amount: 20000,
  transactionType: 'DEBITO',
  transactionChannel: 'CINOOO5A',
  fees: 0,
  vat: 0,
  gmf: 0,
};
export const mockResponseTransactionPts: TransactionPts = {
  messageRS: {
    postingId: '3356182d-34e7-4656-9f09-dd3a9e0c0e73',
    responseType: 'ONLINE',
    confirmationNumber: '16618',
    data: {
      transactionDetails: {
        transactionChannelKey: '8a4434838414d89e01841510a99f0c1f',
        transactionChannelId: 'CIN0005A',
      },
    },
    amount: 20000,
    fees: [],
    notes:
      'Notas Ajustes  Canal~Ajuste~Cuenta Ord.~~ Cuenta Ben.~2000007 ~Sujeto ~RECEIVER~ Concepto ~PRINCIPAL_AMOUNT~BACKOFFICE-DemoPANELADMINISTRATIVO-20230327',
    affectedAmounts: {
      feesAmount: 0,
      overdraftInterestAmount: 0,
      overdraftFeesAmount: 0,
      fractionAmount: 0,
      technicalOverdraftAmount: 0,
      overdraftAmount: 0,
      interestAmount: 0,
      technicalOverdraftInterestAmount: 0,
      fundsAmount: 20000,
    },
    _additionalDetails: {
      linkedTransactionId: 'asdada',
    },
    taxes: null,
    valueDate: '2023-03-27T11:06:57-05:00',
    creationDate: '2023-03-27T11:06:57-05:00',
    type: 'DEPOSIT',
    userKey: '8a444f1b83f219c80183f5b9a60b7768',
    parentAccountKey: '8a44d21b863a1dba01863b848c0e0697',
    accountBalances: {
      totalBalance: 200000,
    },
    terms: {
      interestSettings: null,
      overdraftSettings: {},
      overdraftInterestSettings: {},
    },
    transferDetails: null,
    paymentOrderId: 'a2',
    encodedKey: '8a44bba587224203018723d0c296702e',
    bookingDate: '2023-03-27T11:06:57-05:00',
    id: '16618',
    currencyCode: 'COP',
  },
  errorCode: '0',
  operation: 'PANEL_ADM_CASHIN_PTS_DEPOSIT_CASH_IN.PANEL_ADM.CREDITO_MONTO;',
  roundId: '1;',
  ordinal: '10;',
};

export const mambuRes: ClientMambu = {
  encodedKey: '987654321',
  id: '66775567799338779',
  state: 'INACTIVE',
  creationDate: new Date('2022-12-06T16:31:14-05:00'),
  lastModifiedDate: new Date('2022-12-06T16:31:14-05:00'),
  approvedDate: new Date('2022-12-06T16:31:15-05:00'),
  firstName: 'Pedro',
  lastName: 'Perez',
  mobilePhone: '3216545987',
  emailAddress: 'mock@mail.com',
  preferredLanguage: 'ENGLISH',
  clientRoleKey: '8a444fef82eef2940182ef04eb57070a',
  loanCycle: 0,
  groupLoanCycle: 0,
  groupKeys: [],
  addresses: [],
  idDocuments: [],
  _identificationDocument: {
    identificationNumber: '123456789',
    identificationType: 'Cedula',
  },
  _clientDetails: {
    clientType: 'Dale',
  },
  activationDate: undefined,
  notes: '',
};

export const transactionChanelsMock: ITransactionChanel[] = [
  {
    id: 'c1',
    description: 'mock description 1',
  },
  {
    id: 'c2',
    description: 'mock description 2',
  },
];

export const mambuTransactionChanelsMock: ITransactionChanelMambu[] = [
  {
    encodedKey: '',
    id: 'c1',
    state: 'ACTIVE',
    isDefault: true,
    name: 'c1 - mock description 1',
    loanConstraints: {
      usage: 'UNCONSTRAINED',
      constraints: [],
      matchFiltersOption: 'ALL',
    },
    depositConstraints: {
      usage: 'LIMITED',
      constraints: [
        {
          criteria: 'TYPE',
          operator: 'IN',
          values: [],
        },
      ],
      matchFiltersOption: 'ALL',
    },
    availableForAll: true,
    usageRights: [],
  },
  {
    encodedKey: '',
    id: 'c2',
    state: 'ACTIVE',
    isDefault: false,
    name: 'c2 - mock description 2',
    loanConstraints: {
      usage: 'UNCONSTRAINED',
      constraints: [],
      matchFiltersOption: 'ALL',
    },
    depositConstraints: {
      usage: 'LIMITED',
      constraints: [
        {
          criteria: 'TYPE',
          operator: 'IN',
          values: [],
        },
      ],
      matchFiltersOption: 'ALL',
    },
    availableForAll: true,
    usageRights: [],
  },
];

export const mockAccount: IAccount = {
  id: 'a1',
  holderId: '987654321',
  encodeKey: '',
  balances: 0,
};

export const mambuAccountMock: IAccountMambu = {
  encodedKey: '',
  creationDate: '',
  lastModifiedDate: '',
  id: 'a1',
  name: '',
  accountHolderType: '',
  accountHolderKey: '987654321',
  accountState: '',
  productTypeKey: '',
  accountType: '',
  approvedDate: '',
  activationDate: '',
  lastAccountAppraisalDate: '',
  currencyCode: '',
  internalControls: {
    maxDepositBalance: 0,
  },
  overdraftSettings: {
    allowOverdraft: false,
    overdraftLimit: 0,
  },
  interestSettings: {
    interestPaymentSettings: {
      interestPaymentDates: [],
    },
  },
  balances: {
    totalBalance: 0,
    overdraftAmount: 0,
    technicalOverdraftAmount: 0,
    lockedBalance: 0,
    availableBalance: 0,
    holdBalance: 0,
    overdraftInterestDue: 0,
    technicalOverdraftInterestDue: 0,
    feesDue: 0,
    blockedBalance: 0,
    forwardAvailableBalance: 0,
  },
  accruedAmounts: {
    interestAccrued: 0,
    overdraftInterestAccrued: 0,
    technicalOverdraftInterestAccrued: 0,
    negativeInterestAccrued: 0,
  },
};

export const mockTransaction: ITransaction = {
  id: '123',
  clientIdentificationNumber: '123456789',
  depositNumber: '66775567799338779',
  transactionType: 'MOCK',
  date: new Date(NaN),
  originAccountId: '',
  receivingAccountId: '',
  state: 'Exitoso',
  amount: 123,
  fees: 0,
  vat: 0,
  gmf: 0,
  total: 123,
};

export const transactionWithHeaders = {
  headers: { 'items-total': '10' },
  response: [mockTransaction],
};

export const createTransaction: ICreateTransaction = {
  depositNumber: '',
  amount: 123,
  transactionType: '',
  transactionChannel: '',
};

export const mockCreateTransactionDto: CreateTransactionDto = {
  depositNumber: '',
  amount: 0,
  transactionType: TransactionType.CREDIT,
  transactionChannel: '',
  externalId: '',
  fees: 1,
  vat: 1,
  gmf: 1,
};

export const mambuMockTransaction: TransactionMambu = {
  encodedKey: '',
  id: '123',
  creationDate: undefined,
  valueDate: undefined,
  bookingDate: undefined,
  notes: '',
  parentAccountKey: '',
  type: 'MOCK',
  amount: 123,
  currencyCode: '',
  affectedAmounts: {
    fundsAmount: 0,
    interestAmount: 0,
    feesAmount: 0,
    overdraftAmount: 0,
    overdraftFeesAmount: 0,
    overdraftInterestAmount: 0,
    technicalOverdraftAmount: 0,
    technicalOverdraftInterestAmount: 0,
    fractionAmount: 0,
  },
  taxes: undefined,
  accountBalances: {
    totalBalance: 0,
  },
  userKey: '',
  terms: {
    interestSettings: undefined,
    overdraftInterestSettings: undefined,
    overdraftSettings: undefined,
  },
  transactionDetails: {
    transactionChannelKey: '',
    transactionChannelId: '',
  },
  transferDetails: undefined,
  fees: [],
  _additionalDetails: {
    cus: '',
    ipAddress: '',
    linkedTransactionId: '',
  },
};

export const mockTransactionQuery: TransactionQuery = {
  transactionChannel: '',
  initialDate: new Date(),
  endDate: new Date(),
  depositNumber: '',
  identification: '',
  amount: '',
  receivingAccountId: '',
  idTransactionNumber: '',
  originAccountId: '',
  phone: '',
};

export const mockTransactionQuery2 = {
  messageRS: {
    transactionChannel: '',
    initialDate: new Date(),
    endDate: new Date(),
    depositNumber: '',
    identification: '',
    amount: '',
    receivingAccountId: '',
    idTransactionNumber: '',
    originAccountId: '',
    phone: '',
  },
};

export const balanceResponse: IAccount = {
  encodeKey: '987654321',
  balances: 428872.31,
};

export const balanceResponseMapped: IAccount = {
  balances: 428872.31,
};

export const identification = '12345689';

export const transactionWithoutDate: TransactionQueryQuantity = {
  identification,
};

export const transactionWithDate: TransactionQueryQuantity = {
  ...transactionWithoutDate,
  initialDate: new Date(),
  endDate: new Date(),
};

export const filerCriteriaMock: IFilterCriteria[] = [
  {
    field: '',
    value: '',
  },
  {
    field: '',
    value: '',
  },
];

export const filerCriteria2Mock: IFilterCriteriaFindTransactions = {
  identification: '',
  depositNumber: '',
  phone: '',
  originAccountId: '',
  receivingAccountId: '',
  amount: '',
  transactionType: '',
  idTransactionNumber: '',
  initialDate: new Date('2023-01-12'),
  endDate: new Date('2023-06-09'),
  status: '',
};
export const paginationGetTransactionMock = {
  page: 1,
};
export const findTransactionsMockResponse: IFindTransactionPtsResponse = {
  othersCosts: 0,
  transactionAmount: 20000,
  total: 20000,
  transactionName: 'PSE-Recarga',
  channel: '',
  transactionDateTime: new Date('2023-06-09'),
  referenceNumber: '19623',
  sourceProduct: 'LG-DALE-ATH_RECAUDADORA-0000',
  identificationNumber: '34634636',
  targetProduct: {
    beneficiaryBankId: '43474363',
    beneficiaryAccount: '',
  },
  type: 'DEPOSIT',
  amounts: [
    {
      amount: 20000,
      currency: 'COP',
      operation: 'PRINCIPAL',
      valueDate: '09-JUN-23',
      ordinal: '1',
    },
  ],
  status: 'PENDING_DEFERRED',
  reason: '',
};

export const paginationNewTransactionResponseMock: PaginationNewTransactionResponse =
  {
    current_page: 1,
    per_page: 8,
    results: [],
  };
