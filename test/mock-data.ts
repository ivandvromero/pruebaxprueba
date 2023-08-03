import { AccountCreateResponse } from './../src/providers/pts/dto/pts.dto';
import { AccountStatuses } from '../src/modules/accounts/dto/accounts.dto';
import {
  ErrorCodes,
  ErrorMessage,
  ErrorObjectType,
} from '../src/shared/constants/system-errors';
import {
  CustomException,
  GlobalErrorObjectType,
} from '@dale/shared-nestjs/custom-errors/custom-exception';
import { PtsResponse } from '../src/modules/accounts/dto/pts.dto';
import {
  endpointsPTS,
  headersToken,
  PTS_BASE_URL,
  PTS_USER_LOGIN,
  PTS_PASS_LOGIN,
} from '../src/providers/pts/constants/api';
import { pts } from '../src/constants/common';

import * as objectMapper from 'object-mapper';
import { Account } from '../src/db/accounts/account.entity';
import { v4 as uuid } from 'uuid';
import { HeadersEvent } from 'src/shared/dtos/events.dto';
import {
  AdlCheckTrxInput,
  AdlCheckTrxOutput,
} from '../src/providers/adl/dto/adl.check.trx.dto';
import {
  AdlCheckTrxReportInput,
  AdlCheckTrxReportOutput,
} from 'src/providers/adl/dto/adl.check.report.dto';
import { ConsultarCRMDTO } from 'src/providers/crm/dto/consultar/crmConsulRequest.dto';
import { HeaderDTO } from 'src/shared/models/common-header.dto';
import { DepositResponseCRM } from 'src/providers/crm/dto/actualizar/crmActualResponse.dto';

export const mockMaskedUserId = 'mock-masked-value-for-user-id';
export const mockTrackingId = 'test-trackingId';
export const mockAccountState = AccountStatuses.APPROVED;
export const mockProductId = 'test-product-id';
export const productId = '8a85864d783af42001783e7441e20e23';
export const mockAccountType = 'test-account-type';
export const mockCurrentAccountType = 'CURRENT_ACCOUNT';
export const mockAccountName = 'test-account-name';
export const mockAccountHolderName = 'test-account-holder-name';
export const mockBranchCode = 'test-branch-code';
export const mockClientId = '667755677991234';
export const mockCustomerId = '8a44a5ee83a6ceab0183a873b0602048';
export const mockAccountId = '8a8586367aa95cc1017aaf09c3b6392c';
export const mockToken = 'test-token';
export const mockUuid = 'a1d29cd0-8fb5-4564-a274-150fe838b487';
export const mockAccountNumber = '10000856';
export const mockCurrencyCode = 'GBP';
export const mockPhoneNumber = '312450896';
export const mockEndpoints = endpointsPTS;
export const mockheadersToken = headersToken;
export const mockPtsBaseUrl = PTS_BASE_URL;
export const mockPtsUserLogin = PTS_USER_LOGIN;
export const mockPtsPassLogin = PTS_PASS_LOGIN;

export const mockAccumulatorsResponse: PtsResponse = {
  headerRS: {
    msgId: 'fabf3938-0abe-4014-8589-218c227fd0b8',
    msgIdOrg: 'fabf3938-0abe-4014-8589-218c227fd0b8',
    timestamp: '2023-01-11T16:43:33Z',
  },
  statusRS: {
    code: '0',
    description: 'OK',
  },
  messageRS: {
    accountId: '45519724201',
    accountAvailableAmount: 4602921.2,
    accountStatus: 'ACTIVE',
    accumulators: [
      {
        weeklyQuantity: 0,
        week: 2,
        year: 2023,
        dailyQuantity: 0,
        annualAmount: 0,
        annualQuantity: 0,
        weeklyAmountLimit: 0,
        month: 1,
        dailyAmountLimit: 9000000,
        annualAmountLimit: 0,
        monthAmount: 5000,
        monthlyAmountLimit: 8000000,
        weekAmount: 0,
        monthlyQuantity: 4,
        dailyAmount: 0,
        day: 10,
        accumulator: 'CRE_ACC_SMMLV',
        canUpdate: true,
      },
    ],
  },
};

export const mockDepositAccountHeader = {
  TransactionId: '8a68b583-8d5f-44e0-b4bb-b81c375d3ba9',
  ChannelId: 'DALE-APP',
  SessionId: '8a68b583-8d5f-44e0-b4bb-b81c375d3ba9',
  Timestamp: '2021-08-11T01:23:45.678Z',
  IpAddress: 'IpAddress',
  Application: ' BFF-GQL',
};

export const mockAccountResponse = {
  accountNumber: mockAccountNumber,
  accountState: mockAccountState,
  accountType: mockCurrentAccountType,
  accountId: mockAccountId,
  availableBalance: 0,
  currencyCode: mockCurrencyCode,
};
export const mockExceptionError: ErrorObjectType = {
  code: ErrorCodes.INTERNAL_SERVER_ERROR_CODE,
  message: ErrorMessage.INTERNAL_SERVER_REASON,
};
export const mockGlobalExceptionError: GlobalErrorObjectType = {
  errors: [],
  statusCode: 500,
  message: ErrorMessage.INTERNAL_SERVER_REASON,
};

export const mockException = new CustomException(mockGlobalExceptionError);
export const mockDepositAccountResponse = {
  accountNumber: '10000856',
  accountState: AccountStatuses.APPROVED,
  accountType: 'CURRENT_ACCOUNT',
  accountId: mockAccountId,
  availableBalance: 0,
  currencyCode: 'GBP',
};
export const mockUserData = {
  id: '2b35cf81-68ca-4b1a-bb79-58f72b815237',
  email: 'test-user-email@email.com',
  firstName: 'test-user-firstName',
  lastName: 'test-user-lastName',
  phoneNumber: '1234',
  dob: new Date('1990-01-01'),
  address: {
    buildingNumber: 'test-buildingNumber',
    street: 'test-street',
    town: 'test-town',
    postCode: '123',
    country: 'IND',
  },
};
export const mockCreateAccountData = {
  user: mockUserData,
  productId: productId,
  trackingId: mockTrackingId,
  accountType: mockCurrentAccountType,
  accountName: mockAccountName,
  clientId: mockClientId,
  accountHolderName: mockAccountHolderName,
  branchCode: mockBranchCode,
  uniqueRequestId: mockUuid,
};

export const mockAccountDepositsData = {
  accountHolderId: mockClientId,
  trackingId: mockTrackingId,
};
export const mockAccountDepositsHeader = {
  transactionid: '7485414fa839db1c301839e4d66cb0e08',
  channelid: 'DALE-APP',
  sessionid: '748547fa839db1c301839e4d66cb0e08',
  timestamp: '2021-0-11T01:23:45.678Z',
  ipadress: '0.0.0.0',
  application: 'BFF-Gql',
};

export const mockSuccessStatus = {
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {},
};

export const mockCreateAccountInMambu = {
  data: {
    encodedKey: mockAccountId,
    id: mockAccountNumber,
    accountState: mockAccountState,
    accountType: mockCurrentAccountType,
    balances: {
      availableBalance: 0,
    },
    currencyCode: mockCurrencyCode,
  },
  ...mockSuccessStatus,
};

export const mockAccountDetailsData = [
  {
    id: '100',
    accountState: mockAccountState,
    accountType: mockAccountType,
    currencyCode: mockCurrencyCode,
  },
  {
    id: '101',
    accountState: mockAccountState,
    accountType: mockAccountType,
    currencyCode: mockCurrencyCode,
  },
  {
    id: '102',
    accountState: mockAccountState,
    accountType: mockAccountType,
    currencyCode: mockCurrencyCode,
  },
];
export const mockAccountDetailsByClientIdResponse = [
  {
    accountNumber: '100',
    accountState: mockAccountState,
    accountType: mockAccountType,
    currencyCode: mockCurrencyCode,
  },
  {
    accountNumber: '101',
    accountState: mockAccountState,
    accountType: mockAccountType,
    currencyCode: mockCurrencyCode,
  },
  {
    accountNumber: '102',
    accountState: mockAccountState,
    accountType: mockAccountType,
    currencyCode: mockCurrencyCode,
  },
];
export const mockAccountDetails = {
  data: mockAccountDetailsData,
  ...mockSuccessStatus,
};
export const mockErrorData = {
  errors: [
    {
      errorReason: 'Test error 1 occurred',
      errorSource: 'Test error 1 occurred',
    },
    {
      errorReason: 'Test error 1 occurred',
      errorSource: 'Test error 2 occurred',
    },
  ],
};
export const mockExpectedErrorObject = [
  {
    code: ErrorCodes.ACCOUNT_PROVIDER_ERROR_CODE,
    message: 'test error 1 occurred',
  },
  {
    code: ErrorCodes.ACCOUNT_PROVIDER_ERROR_CODE,
    message: 'test error 1 occurred',
  },
];
export const mockErrors = {
  response: {
    data: { ...mockErrorData },
  },
};
export const mockResponseObjet = {
  id: '100',
  accountState: mockAccountState,
  accountType: mockAccountType,
  currencyCode: mockCurrencyCode,
};
export const mockResponseObjetMambu = {
  accountNumber: '100',
  accountState: mockAccountState,
  accountType: mockAccountType,
  currencyCode: mockCurrencyCode,
};
export const mockResponse = [
  {
    id: '100',
    accountState: mockAccountState,
    accountType: mockAccountType,
    currencyCode: mockCurrencyCode,
  },
];
export const mockSuccessResponse = {
  data: mockResponse,
  ...mockSuccessStatus,
};
export const mockHeader = {
  headers: { Accept: 'application/vnd.mambu.v2+json' },
};
export const mockError = new Error('test-error');
export const mockExpectedErrorObject500 = {
  code: ErrorCodes.INTERNAL_SERVER_ERROR_CODE,
  message: ErrorMessage.INTERNAL_SERVER_REASON,
};
export const mockError401 = {
  message: 'Test exception',
  response: {
    status: 401,
    data: { ...mockErrorData },
  },
};
export const mockExpectedErrorObject401 = {
  code: ErrorCodes.UNAUTHORIZED_CODE,
  message: ErrorMessage.UNAUTHORIZED_REASON,
};
export const mockError500 = {
  message: 'Test exception',
  response: {
    status: 500,
    data: { ...mockErrorData },
  },
};
export const mockDefaultError500 = [...mockExpectedErrorObject];
export const mockError400 = {
  message: 'Test exception',
  response: {
    status: 400,
    data: { ...mockErrorData },
  },
};
export const mockExpectedErrorObject400 = {
  code: ErrorCodes.ACCOUNT_PROVIDER_ERROR_CODE,
  message: ErrorMessage.ACCOUNT_PROVIDER_ERROR_REASON,
};
export const mockError404 = {
  message: 'Test exception',
  response: {
    status: 404,
    data: { ...mockErrorData },
  },
};
export const mockExpectedErrorObject404 = {
  code: ErrorCodes.ENDPOINT_DOES_NOT_EXIST_CODE,
  message: ErrorMessage.ENDPOINT_DOES_NOT_EXIST_REASON,
};

export const mockAccountNumbers = { accountNumbers: ['100', '101', '102'] };
export const mockAccountNumbersPresent = { accountNumbers: ['100'] };
export const mockCreateTmAccountPayload = {
  userId: mockUserData.id,
  requestId: mockUuid,
  customerId: mockClientId,
  accountType: 'basicCurrentAccount',
  trackingId: mockTrackingId,
};
export const mockCreateTmAccount = {
  accountId: mockAccountId,
  accountState: 'ACCOUNT_STATUS_OPEN',
};
export const mockAccountParams = {
  versionId: '1',
  instanceParamVals: {
    interest_application_day: '1',
  },
};
export const mockCreateTmAccountResponse = {
  data: {
    id: mockAccountId,
    status: 'ACCOUNT_STATUS_OPEN',
  },
  ...mockSuccessStatus,
};

const mockTmAccountDetails = {
  product_id: 'current_account',
  product_version_id: '1',
  permitted_denominations: ['USD', 'GBP', 'EUR'],
  status: 'ACCOUNT_STATUS_OPEN',
  opening_timestamp: '2021-11-18T14:53:54.166895Z',
  stakeholder_ids: ['2311227877021519654'],
  instance_param_vals: {
    arranged_overdraft_limit: '500.00',
    autosave_savings_account: '',
    daily_atm_withdrawal_limit: '',
    interest_application_day: '1',
    unarranged_overdraft_limit: '1000.00',
  },
};

export const mockFetchTmAccountByAccountIdResponse = {
  data: {
    id: mockAccountId,
    ...mockTmAccountDetails,
  },
  ...mockSuccessStatus,
};

export const mockFetchedTmAccountDetails = {
  accountId: mockAccountId,
  accountType: 'current_account',
  currencyCode: 'USD',
  accountState: 'ACCOUNT_STATUS_OPEN',
  customerId: '2311227877021519654',
};

export const mockFineractCreateAccount = {
  accountId: 1,
};

export const mockFineractFetchAccountById = {
  accountId: 1,
  clientId: 2,
};

export const mockCreateFineractAccountPayload = {
  clientId: 2,
  productId: 1,
};

export const mockFetchedTmAccounts = [mockFetchedTmAccountDetails];

export const mockTmAccounts = [
  {
    id: '01440771331881091461',
    ...mockTmAccountDetails,
  },
  {
    id: '01440771331881091461',
    ...mockTmAccountDetails,
  },
  {
    id: '01440771331881091461',
    ...mockTmAccountDetails,
  },
  {
    id: '01440771331881091461',
    ...mockTmAccountDetails,
  },
];

export const mockFetchedTmAccountNumbers = mockTmAccounts.map(
  (account) => account.id,
);

export const mockFetchedTmAccountsDetails = mockTmAccounts.map((account) =>
  objectMapper(account),
);

export const mockFetchTmAccountsByCustomerIdResponse = {
  data: {
    accounts: mockTmAccounts,
  },
  ...mockSuccessStatus,
};

export const mockTmAccountNumbers = {
  accountNumbers: mockFetchedTmAccountNumbers,
};

export const mockFetchLiveBalanceResponse = {
  data: {
    balances: [
      {
        id: '83_',
        account_id: '5076652d-db01-ed0a-b637-b4f4d9c7dddc',
        account_address: 'DEFAULT',
        phase: 'POSTING_PHASE_PENDING_OUTGOING',
        asset: 'COMMERCIAL_BANK_MONEY',
        denomination: 'EUR',
        posting_instruction_batch_id: '',
        update_posting_instruction_batch_id: '',
        value_time: '1970-01-01T00:00:00Z',
        amount: '0',
        total_debit: '0',
        total_credit: '0',
      },
    ],
    previous_page_token: '',
    next_page_token:
      'CAESKAokNTA3NjY1MmQtZGIwMS1lZDBhLWI2MzctYjRmNGQ5YzdkZGRjEAA',
  },
  ...mockSuccessStatus,
};

export const mockLiveBalance = {
  balance: '0',
};

export const mockFineractHttpAccountDetailsResponse = {
  data: {
    id: 1,
    accountNo: '000000001',
    clientId: 2,
    clientName: 'small business',
    savingsProductId: 1,
    savingsProductName: 'Passbook Savings',
  },
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {},
};

export const mockFineractHttpCreateAccountResponse = {
  data: {
    officeId: 1,
    clientId: 2,
    savingsId: 2,
    resourceId: 1,
    gsimId: 0,
  },
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {},
};

export const mockAccumulators = {
  weeklyQuantity: 0,
  week: 45,
  year: 2022,
  dailyQuantity: 0,
  annualAmount: 0,
  annualQuantity: 0,
  weeklyAmountLimit: 0,
  month: 11,
  dailyAmountLimit: 0,
  annualAmountLimit: 0,
  monthAmount: 1332,
  monthlyAmountLimit: 0,
  weekAmount: 0,
  monthlyQuantity: 12,
  dailyAmount: 0,
  day: 9,
};

export const mockAccumulatorsNew = {
  accumulator: 'xsxs',
  weeklyQuantity: 0,
  week: 45,
  year: 2022,
  dailyQuantity: 0,
  annualAmount: 0,
  annualQuantity: 0,
  weeklyAmountLimit: 0,
  month: 11,
  dailyAmountLimit: 0,
  annualAmountLimit: 0,
  monthAmount: 1332,
  monthlyAmountLimit: 0,
  weekAmount: 0,
  monthlyQuantity: 12,
  dailyAmount: 0,
  day: 9,
};

export const mockHeaderRS = {
  msgId: '6c623cd0-ffc8-4804-9cab-883a5644c80a',
  msgIdOrg: '',
  timestamp: '2022-10-18T21:40:55Z',
};

export const mockStatusRS = {
  code: '0',
  description: 'OK',
};

export const mockMessageRS = {
  accountId: 'ACC111TEST12345678118',
  accountAvailableAmount: 1000000,
  accountStatus: 'ACTIVE',
  accumulator: [mockAccumulators],
};

export const mockMessageRSNew: any = {
  accountId: 'ACC111TEST12345678118',
  accountAvailableAmount: 1000000,
  accountStatus: 'ACTIVE',
  accumulators: [mockAccumulatorsNew],
};

export const mockAccountLimits = {
  messageRS: mockMessageRS,
  headerRS: mockHeaderRS,
  statusRS: mockStatusRS,
};

export const mockAccountLimitsNew: PtsResponse = {
  messageRS: mockMessageRSNew,
  headerRS: mockHeaderRS,
  statusRS: mockStatusRS,
};

export const mockHeaderPTS = {
  Authorization: 'Bearer TOKEN LOL',
  'Content-Type': pts.PTS_CONTENT_TYPE_JSON,
  CHANNEL: pts.PTS_pCHANNEL,
};

export const mockHeaderDto = {
  TransactionId: '8a68b583-8d5f-44e0-b4bb-b81c375d3ba9',
  ChannelId: 'DALE-APP',
  SessionId: '8a68b583-8d5f-44e0-b4bb-b81c375d3ba9',
  Timestamp: '2021-0-11T01:23:45.678Z',
  IpAddress: 'IpAddres',
  Application: 'BFF-Gql',
  'user-agent': 'ttt',
};
export const headersEventMock: HeadersEvent = {
  transactionId: '8a68b583-8d5f-44e0-b4bb-b81c375d3ba9',
  channelId: 'DALE-APP',
  sessionId: '8a68b583-8d5f-44e0-b4bb-b81c375d3ba9',
  timestamp: '2021-0-11T01:23:45.678Z',
  ipAddress: 'IpAddres',
  application: 'BFF-Gql',
  'user-agent': 'ttt',
};

export const mockAccount: Account = {
  id: '2b35cf81-68ca-4b1a-bb79-58f72b815237',
  accountNumber: '200059',
  userId: '2b35cf81-68ca-4b1a-bb79-58f72b815249',
  status: 1,
};

export const mockAccountCreateResponse: AccountCreateResponse = {
  headerRS: {
    msgId: '',
    msgIdOrg: '',
    timestamp: '',
  },
  statusRS: {
    code: '',
    description: '',
  },
  messageRS: {
    ThirdPartyData: {
      encodedKey: '',
      creationDate: '',
      lastModifiedDate: '',
      id: 'id',
      name: '',
      accountHolderType: '',
      accountHolderKey: '',
      accountState: '',
      productTypeKey: '',
      accountType: '',
      approvedDate: '',
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
      overdraftInterestSettings: undefined,
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
    },
    internalAccountId: '',
    currency: 'COP',
    bankId: 'dale',
    country: 'CO',
    legacy: {
      legacyAccountNumber: '',
      legacyAccountType: '',
      legacyBranchId: '',
    },
    othersId: {
      DALE: 'daleid',
      MAMBU: 'mambuid',
    },
  },
};

export const mockHeadersKafka = {
  ipAddress: '127.0.0.1',
  apiversion: '1',
  transactionId: uuid(),
  accept: '*/*',
  timestamp: '2011-10-05T14:48:00.000Z',
  application: 'Postman-ConfigurationService',
  channelId: 'POSTMAN',
  'accept-encoding': 'gzip, deflate, br',
  'user-agent': 'PostmanRuntime/7.31.3',
};

export const mockCheckResultSuccess = {
  dbConnection: {
    connectionStatus: true,
    message: 'Account service is  connected to Account Database',
  },
  kafka: {
    kafkaConnection: true,
    message: 'Kafka ok',
  },
  redis: {
    redisConnection: true,
    message: 'Redis ok',
  },
};
export const mockCheckResultFailure = {
  dbConnection: {
    connectionStatus: false,
  },
  kafka: {
    kafkaConnection: false,
  },
  redis: {
    redisConnection: 'Connection is closed.',
  },
};

export const responseError = {
  response: {
    data: {
      error: {
        code: 'OTP002',
        message: 'Error al generar OTP',
      },
    },
  },
  config: {},
  isAxiosError: true,
  toJSON: null,
  name: '',
  message: '',
};
export const responseErrorNotHandled = {
  response: {
    data: {
      error: {
        message: 'Error no controlado',
      },
    },
  },
  config: {},
  isAxiosError: true,
  toJSON: null,
  name: '',
  message: '',
};
export const mockHeadersEvent: HeadersEvent = {
  application: '',
  'user-agent': '',
  channelId: '',
  ipAddress: '',
  timestamp: '',
  transactionId: '',
  attempts: '1',
  sessionId: '',
};

export const adlAuthInputMock = {
  unique_id: 'mine_postman_12345',
};

export const adlAuthOutputMock = {
  unique_id: 'mine_postman_12345',
  status_code: 200,
  cognito_token: {
    access_token:
      'eyJraWQiOiJhWmJUNVlLV3ZwZVZHcHkwRmhcL2pUV0xOSWpVQjVjV25LN2p5K3lxaldEND0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIzNGxoM21uNzh1OGxwYTgyc2M3NWRudW1ibiIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXBpLXNjb3Blc1wvcG9zdF9jaGVjayIsImF1dGhfdGltZSI6MTY4NjY4NTA3NywiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMi5hbWF6b25hd3MuY29tXC91cy1lYXN0LTJfR2M1T2c0UzRJIiwiZXhwIjoxNjg2Njg4Njc3LCJpYXQiOjE2ODY2ODUwNzcsInZlcnNpb24iOjIsImp0aSI6ImI1MGQzYzE2LWQ0NWEtNDBkNC04MThjLTJiYjFlZmE1OTVlOSIsImNsaWVudF9pZCI6IjM0bGgzbW43OHU4bHBhODJzYzc1ZG51bWJuIn0.AZt0J4y3ptvbcMBWwLk6iYq_OhDYgqkBPaCJNZXjzz4wQueCt4Qq5NKLe6l-w1KLShuOMKrT7RThvAwobx_Z1fxAS6zxQVmfzEYv8O1cvxYJ5btuP74pk48Am1EiyDAxluN2noo5IKbqxoeDegJRMdgTHNXebA5RCqWPUPNDdZPIelEtv_f_ybXpL1DorAaqxtMS6WmS7LESHdC6ml9JXHyhb7nYEx_2t5goGawUzbRkBU_m140zx_YSyoTtcMhS8CvDn4XoRnZtgUWAQDte8f0sjzWn-72sG5jL3IrwGSrLo90gYOH3WcsF6_LUGoYXY041eIxsnnm7e3fYbeBVkQ',
    expires_in: 3600,
    token_type: 'Bearer',
  },
};

export const adlCheckTrxReportInputMock: AdlCheckTrxReportInput = {
  unique_id: 'mi_postman_16',
  job: 'gmf',
  DocumentNumber: '555556655555',
  AccountNumber: '2000207',
  Year: 2023,
};

export const adlCheckTrxReportOutputMock: AdlCheckTrxReportOutput = {
  unique_id: 'mi_postman_16',
  status_code: 200,
  response: {
    Name: 'None None None None',
    Email: 'None',
    DocumentNumber: '555556655555',
    AccountNumber: '2000207',
    Year: 2023,
    Summary: {
      TotalBase: 0,
      TotalGMF: 0,
    },
  },
};

export const adlCheckTrxInputMock: AdlCheckTrxInput = {
  unique_id: 'mi_postman_32',
  job: 'trx',
  DocumentNumber: '555556655555',
  AccountNumber: '2000207',
  StartDate: '2023-05-16',
  EndDate: '2023-05-23',
};

export const adlCheckTrxOutputMock: AdlCheckTrxOutput = {
  unique_id: 'mi_postman_32',
  status_code: 200,
  response: {
    Name: 'None None None None',
    AccountNumber: '2000207',
    StartDate: '2023-05-16',
    EndDate: '2023-05-23',
    Summary: {
      BalanceInitial: 999970.25,
      TotalAbonos: 100004.75,
      TotalCharges: 4.75,
      TotalCommission: 0,
      TotalIVA: 4.75,
      TotalGMF: 0.0,
      TotalRetention: 0,
      BalanceFinal: 999970.25,
    },
    Details: [
      {
        DateTransacion: '2023-05-02',
        TimeTransacion: '17:29:02',
        Concept: 'intrasolucion',
        Debit: 4.75,
        Credit: 4.75,
        Balance: 999970.25,
      },
      {
        DateTransacion: '2023-05-02',
        TimeTransacion: '17:29:02',
        Concept: 'intrasolucion',
        Debit: 0.0,
        Credit: 0.0,
        Balance: 999970.25,
      },
      {
        DateTransacion: '2023-05-02',
        TimeTransacion: '17:29:02',
        Concept: 'intrasolucion',
        Debit: 100000.0,
        Credit: 100000.0,
        Balance: 999970.25,
      },
    ],
  },
};

export const inputDataMock = {
  templateName: 'accountCertificate',
  accountId: '2',
  params: [
    {
      key: 'formalTitle',
      value: 'Señor',
    },
    {
      key: 'recipientName',
      value: 'Juan Pablo',
    },
    {
      key: 'withBalance',
      value: 'true',
    },
  ],
  user: {
    email: 'test@test.com',
    id: '123',
    status: 'NEWLY_REGISTERED',
    phoneNumber: '3124567899',
    documentNumber: '123456789',
    documentType: '2',
    firstName: 'Marianela',
    firstSurname: 'Ramirez',
    secondSurname: 'Marín',
  },
};

export const getCertificateInfoMockResponse = {
  templateName: 'accountCertificate',
  data: [
    { key: 'formalTitle', value: 'Señor' },
    { key: 'recipientName', value: 'Juan Pablo' },
    { key: 'withBalance', value: true },
    { key: 'accountBalance', value: 1000000 },
    { key: 'phoneNumber', value: '3124567899' },
    { key: 'documentType', value: 'Cédula de ciudadanía' },
    { key: 'documentNumber', value: '123456789' },
    { key: 'holderName', value: 'MARIANELA RAMIREZ MARÍN' },
    { key: 'accountId', value: '2' },
    { key: 'accountOpeningDate', value: 27373 },
  ],
};

export const getCertificateMockResponse = 'url:1234/archivo.pdf';
export const mockPtsResponse = {
  data: {
    messageRS: {},
    headerRS: {
      msgId: '',
      msgIdOrg: '',
      timestamp: '',
    },
    statusRS: {
      code: '0',
      description: 'Success',
    },
  },
};

export const mockModifyLimitsBody = {
  accountId: '123',
  accumulators: [
    {
      idOption: '123',
      nameOption: 'test',
      accumulator: 'accum',
      dailyAmountLimit: 0,
      dailyQuantityLimit: 1,
      permittedLimits: 3,
      hasUpdates: true,
    },
  ],
};

export const mockPermittedModificationsResponse = {
  data: {
    accountId: '1234',
    accumulators: [
      {
        code: '200',
        idOption: '123',
        nameOption: 'test',
        description: `Se supero el limite de 3 intentos permimitos para modificar test`,
        availableModifications: 0,
      },
    ],
  },
};

export const mockModifyLimitsResponse = {
  data: {
    accountId: '123',
    accumulators: [
      {
        code: '0',
        idOption: '123',
        nameOption: 'test',
        description: 'Success',
        availableModifications: 2,
      },
    ],
  },
};

export const mockStatementsInputData = {
  templateName: 'accountStatements',
  accountId: '200020',
  user: {
    id: '11111Test',
    firstName: 'Andres',
    secondName: 'Felipe',
    firstSurname: 'Garcia',
    secondSurname: 'Betancur',
    status: 'ACTIVE',
  },
  params: [
    {
      key: 'accountId',
      value: '200020',
    },
    {
      key: 'year',
      value: '2023',
    },
    {
      key: 'month',
      value: 'Julio',
    },
  ],
};

export const mockStatementsStrategyResponse = {
  templateName: 'accountStatements',
  data: [
    {
      key: 'accountId',
      value: '200020',
    },
    {
      key: 'year',
      value: '2023',
    },
    {
      key: 'month',
      value: 'Julio',
    },
    {
      key: 'names',
      value: 'ANDRES FELIPE GARCIA BETANCUR',
    },
    {
      key: 'initial_balance',
      value: 999970.25,
    },
    {
      key: 'final_balance',
      value: 999970.25,
    },
    {
      key: 'total_payments',
      value: 100004.75,
    },
    {
      key: 'total_charges',
      value: 4.75,
    },
    {
      key: 'total_commission',
      value: 0,
    },
    {
      key: 'total_iva',
      value: 4.75,
    },
    {
      key: 'total_gmf',
      value: 0,
    },
    {
      key: 'total_holding',
      value: 0,
    },
    {
      key: 'interest_rate',
      value: 0,
    },
    {
      key: 'TableHead',
      value: [
        'Fecha operación',
        'Hora',
        'Descripción',
        'Débito',
        'Crédito',
        'Saldo',
      ],
    },
    {
      key: 'TableBody',
      value: [
        {
          DateTransaction: '2023-05-02',
          TimeTransaction: '17:29:02',
          Concept: 'intrasolucion',
          Debit: 4.75,
          Credit: 4.75,
          Balance: 999970.25,
        },
      ],
    },
  ],
};

export const mockStatementsCheckTrxResponse = {
  unique_id: 'mi_postman_32',
  status_code: 200,
  response: {
    Name: 'None None None None',
    AccountNumber: '2000207',
    StartDate: '2023-05-16',
    EndDate: '2023-05-23',
    Summary: {
      BalanceInitial: '999970.25',
      TotalAbonos: 100004.75,
      TotalCharges: 4.75,
      TotalCommission: 0,
      TotalIVA: 4.75,
      TotalGMF: 0,
      TotalRetention: 0,
      BalanceFinal: 999970.25,
    },
    Details: [
      {
        DateTransacion: '2023-05-02',
        TimeTransacion: '17:29:02',
        Concept: 'intrasolucion',
        Debit: 4.75,
        Credit: '4.75',
        Balance: '999970.25',
      },
    ],
  },
};

export const queryParams: ConsultarCRMDTO = {
  phone: 0,
  depositNumber: 0,
  identification: 0,
};
export const headers: HeaderDTO = {
  TransactionId: '',
  ChannelId: '',
  Timestamp: '',
  IpAddress: '',
  Application: '',
};
export const expectedResponse: DepositResponseCRM = {};
