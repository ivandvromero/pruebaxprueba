import * as ExcelJs from 'exceljs';
import { TransactionType } from '@dale/client/modules/dto';
import {
  MonetaryAdjustmentDto,
  AdjustmentQueryDto,
  PatchTransactionLevelDTO,
  AdjustmentStateDto,
  AdjustmentValidationsDTO,
  GetAdjustmentQueryReportsDto,
} from '@dale/monetary-adjustment/modules/monetary-adjustment/dto';
import { FileMassiveMonetaryAdjustment } from '@dale/monetary-adjustment/repositories/file-monetary-adjustment/massive-monetary-adjustment-file.entity';
import {
  GetAdjustmentsResponse,
  PaginationAdjustmentsResponse,
} from '@dale/monetary-adjustment/shared/common';
import {
  AdjustmentState,
  AdjustmentReason,
} from '@dale/monetary-adjustment/shared/enums';
import {
  MonetaryAdjustmentInterface,
  ResponseInterface,
} from '@dale/monetary-adjustment/shared/interfaces';
import { UpdateSingleAdjustmentsResponse } from '@dale/monetary-adjustment/shared/interfaces/update-single-adjustments-response.interface';
import { UserInfoInterface } from '@dale/monetary-adjustment/shared/interfaces/user-info.interface';

export const adjustmentDto: MonetaryAdjustmentDto = {
  clientId: '1234567890',
  depositNumber: 'ABC123',
  amount: 100000,
  validateAmount: 100000,
  adjustmentType: TransactionType.CREDIT,
  adjustmentState: AdjustmentState.ACCEPTED,
  transactionLevel: 1,
  transactionCode: 'COU0003A',
  transactionDescription:
    'Ajuste Débito por Transferencia INTRASOLUCION- Con Cargo a un Deposito Electrónico',
  fees: 1.9,
  vat: 19,
  gmf: 0.4,
  comment: null,
  adjustmentReason: AdjustmentReason.AJUSTE_POR_CONCILIACION,
};

export const req = {
  user: {
    name: 'John Capturer',
    apiConfigMonetaryAdjustmentroles: 'MonetaryAdjustment-Capturer',
  },
  userInfo: {
    email: 'johnCapturer@mail.com',
    name: 'John Capturer',
    role: 'MonetaryAdjustment-Capturer',
    transactionLevel: '1',
  },
};

export const reqValidator = {
  user: {
    name: 'John Validator',
    apiConfigMonetaryAdjustmentroles: 'MonetaryAdjustment-Validator',
  },
  userInfo: {
    email: 'johnValidator@mail.com',
    name: 'John Validator',
    role: 'MonetaryAdjustment-Validator',
    transactionLevel: '2',
  },
};

export const userName = 'John Capturer';

export const adjustmentMetadataDto: UserInfoInterface = {
  role: 'MonetaryAdjustment-Capturer',
  email: 'johnCapturer@mail.com',
  transactionLevel: 0,
};

export const adjustmentMetadataDtoValidator: UserInfoInterface = {
  role: 'MonetaryAdjustment-Validator',
  email: 'johnValidator@mail.com',
  transactionLevel: 1,
};

export const adjustmentMetadataDtoCapturer: UserInfoInterface = {
  role: 'MonetaryAdjustment-Capturer',
  email: 'johnCapturer@mail.com',
  transactionLevel: 2,
};

export const roleFound = ['MonetaryAdjustment-Capturer'];
export const transactionCodeFound = 'ABC123';
export const transactionCodesArray = ['ABC123', 'ABC124'];
export const emailFound = 'backoffice-validator@yopmail.com';

export const adjustmentErrorDto: MonetaryAdjustmentDto = {
  clientId: '1234567890',
  depositNumber: 'ABC123',
  amount: 100000,
  validateAmount: 100001,
  adjustmentType: TransactionType.CREDIT,
  adjustmentState: AdjustmentState.ACCEPTED,
  transactionLevel: 1,
  transactionCode: 'COU0003A',
  transactionDescription:
    'Ajuste Débito por Transferencia INTRASOLUCION- Con Cargo a un Deposito Electrónico',
  fees: 1.9,
  vat: 19,
  gmf: 0.4,
  comment: null,
  adjustmentReason: AdjustmentReason.AJUSTE_POR_CONCILIACION,
};

export const outputAdjustment = {
  ...adjustmentDto,
  id: '12345565789',
  assignedTo: 'backoffice-validator@yopmail.com',
  updateRegister: {
    userEmail: [
      'backoffice-capturer@yopmail.com',
      'backoffice-validator@yopmail.com',
      'backoffice-approver@yopmail.com',
    ],
    user: [
      'Backoffice Capturer',
      'Backoffice Validator',
      'Backoffice Approver',
    ],
  },
};

export const outputAdjustmentWithRelations = {
  ...outputAdjustment,
  updateRegister: {
    userEmail: ['backoffice-validator@yopmail.com'],
  },
};

export const updateRegister = {
  id: 'cf57688c-36ce-43e2-96d7-78a6551ae4c9',
  user: ['John Capturer'],
  userEmail: ['JohnCapturer@yopmail.com'],
  updatedAt: ['Tue May 02 2023 13:55:09 GMT-0500 (hora estándar de Colombia)'],
};

export const findOneAdjustmentWithRelations = {
  ...outputAdjustment,
  updateRegister,
};

export const getAdjustmentResponse: GetAdjustmentsResponse = {
  id: '12345565789',
  clientId: '1234567890',
  depositNumber: 'ABC123',
  amount: 100000,
  adjustmentType: TransactionType.CREDIT,
  transactionCode: 'COU0003A',
  transactionDescription:
    'Ajuste Débito por Transferencia INTRASOLUCION- Con Cargo a un Deposito Electrónico',
  createdAt: undefined,
  adjustmentState: AdjustmentState.ACCEPTED,
  comment: '',
  verifier: 'Backoffice Validator',
  approver: 'Backoffice Approver',
};

export const getAdjustmentResponseWithPagination: PaginationAdjustmentsResponse =
  {
    results: [getAdjustmentResponse],
    total: 1,
    current_page: 1,
    per_page: 1,
    total_pages: 1,
  };

export const outputAdjustmentLevel2 = {
  ...adjustmentDto,
  transactionLevel: 2,
  adjustmentState: AdjustmentState.PENDING,
  id: '12345565789',
};

export const adjustmentDtoIncorrectAmount: MonetaryAdjustmentInterface = {
  clientId: '1234567890',
  depositNumber: 'ABC123',
  amount: 100000,
  validateAmount: 100001,
  adjustmentType: TransactionType.CREDIT,
  adjustmentState: AdjustmentState.ACCEPTED,
  transactionLevel: 1,
  transactionCode: 'COU0003A',
  transactionDescription:
    'Ajuste Débito por Transferencia INTRASOLUCION- Con Cargo a un Deposito Electrónico',
  fees: 1.9,
  vat: 19,
  gmf: 0.4,
  comment: null,
  adjustmentReason: AdjustmentReason.AJUSTE_POR_CONCILIACION,
};

export const oneAdjustmentWithErrors: MonetaryAdjustmentDto = {
  clientId: '1234567890',
  depositNumber: 'ABC123',
  amount: 100000,
  validateAmount: 100000,
  adjustmentType: null,
  adjustmentState: null,
  transactionLevel: 1,
  transactionCode: 'COU0003A',
  transactionDescription:
    'Ajuste Débito por Transferencia INTRASOLUCION- Con Cargo a un Deposito Electrónico',
  fees: 1.9,
  vat: 19,
  gmf: 0.4,
  comment: 'Ajuste por error en la app',
  adjustmentReason: null,
};

export const emptyAdjustmentQuery: AdjustmentQueryDto = {};

export const adjustmentQuery: AdjustmentQueryDto = {
  limit: 1,
  offset: 0,
};

export const adjustmentQueryWithLevel: AdjustmentQueryDto = {
  limit: 1,
  offset: 0,
};

export const adjustmentId = '12345565789';
export const wrongAdjustmentId = 'a wrong id';
export const newTransactionLevel = 1;
export const newAdjustmentState = AdjustmentState.ACCEPTED;
export const rejectedAdjustmentState = AdjustmentState.REJECTED;
export const comment = 'This is a comment';
export const massiveAdjustmentId = '1233554488';

export const patchAdjustmentLevel: PatchTransactionLevelDTO = {
  newTransactionLevel,
};

export const mockAdjustmentStateDto: AdjustmentStateDto = {
  rejected: 0,
  approved: 1,
};

export const adjustmentApproved: AdjustmentValidationsDTO = {
  approved: true,
};

export const adjustmentRejected: AdjustmentValidationsDTO = {
  approved: false,
  comment: comment,
};

export const adjustmentRejectedWithoutComment: AdjustmentValidationsDTO = {
  approved: false,
};

export const responseInterface: ResponseInterface = {
  result: true,
  nextLevel: 2,
};

export const responseInterfaceDispatch: ResponseInterface = {
  nextLevel: null,
  result: true,
  status: AdjustmentState.ACCEPTED,
};

export const responseInterfaceDispatchWithErrors: ResponseInterface = {
  nextLevel: null,
  result: true,
  status: AdjustmentState.ACCEPTED_WITH_ERROR,
};

export const responseInterfaceDispatchFailed: ResponseInterface = {
  nextLevel: null,
  result: false,
  status: AdjustmentState.FAILED,
};

export const responseInterfaceNull: ResponseInterface = {
  id: '12345565789',
  result: true,
  nextLevel: null,
};

export const responseInterfaceFalse: ResponseInterface = {
  result: false,
  nextLevel: null,
};

export const rejectResponseInterface: ResponseInterface = {
  result: true,
};

export const fileMassiveMonetaryAdjustmentsMock: FileMassiveMonetaryAdjustment =
  {
    comment: '',
    createdAt: null,
    fileName: 'Juan',
    formattedName: 'archivo.xlsx',
    id: '1233554488',
    frontId: '1',
    size: 8,
    totalCredit: 0,
    totalDebit: 0,
    totalRecords: 0,
    transactionLevel: 1,
    updatedAt: null,
    adjustments: [
      {
        id: '123',
        dateFile: null,
        clientId: '156asad4s5',
        depositNumber: '121',
        amount: 1200,
        adjustmentType: TransactionType.DEBIT,
        adjustmentState: AdjustmentState.PENDING,
        transactionLevel: 0,
        transactionCode: 'COU005',
        transactionDescription: 'Sin comentario',
        fees: 0,
        vat: 0,
        gmf: 0,
        createdAt: null,
        updatedAt: null,
        comment: '',
        isFromFile: true,
        adjustmentReason: AdjustmentReason.AJUSTE_POR_CONCILIACION,
        responsible: 'Khetna',
        transactionName: '',
      },
    ],
    usersEmails: [],
  };

export const okResponse: UpdateSingleAdjustmentsResponse = {
  hasError: false,
  notAccepted: false,
};

export const okResponsePTS = [{ statusRS: { code: 0 } }];

const okWithErrorResp = new Error();
okWithErrorResp.message = JSON.stringify({
  statusRS: {
    description: 'Something went wrong',
  },
});

export const okWithErrorResponsePTS = [okWithErrorResp];

export const okWithErrorsResponse: UpdateSingleAdjustmentsResponse = {
  hasError: false,
  notAccepted: true,
};

const failedResp = new Error(
  JSON.stringify({
    error: {
      description: 'Something went wrong',
    },
  }),
);

export const failedResponsePTS = [failedResp];

export const failedResponse: UpdateSingleAdjustmentsResponse = {
  hasError: true,
  notAccepted: false,
};

export const getMassiveMonetaryAdjustmentMock = {
  formattedName: 'test_file.xlsx',
  adjustments: [
    {
      dateFile: '2022-01-01',
      depositNumber: '12345',
      amount: 100,
      adjustmentType: 'CREDIT',
      transactionCode: '123',
      transactionDescription: 'Test transaction',
      fees: 10,
      vat: 5,
      gmf: 0,
      adjustmentReason: 'Test reason',
      responsible: 'Test user',
      comment: '',
      transactionName: 'Test transaction name',
    },
  ],
};

export const workbookMock = {
  addWorksheet: jest.fn().mockReturnValue({
    columns: [],
    addRow: jest.fn(),
    spliceColumns: jest.fn(),
    getColumn: jest.fn().mockReturnValue({
      width: 0,
    }),
  }),
  xlsx: {
    writeBuffer: jest.fn().mockResolvedValue(Buffer.from([])),
  },
};
jest.spyOn(ExcelJs, 'Workbook').mockReturnValue(workbookMock as any);

export const ptsError = {
  messageRS: {
    code: '-1781',
    description: 'PANEL_INVALID_TRANSACTION_CHANNEL',
  },
  headerRS: {
    msgId: '85213d9e-6791-466f-a426-2bae0af726f7',
    msgIdOrg: 'PanelAdm449',
    timestamp: '2023-04-10T19:21:34Z',
  },
  statusRS: {
    code: '-1781',
    description: 'PANEL_INVALID_TRANSACTION_CHANNEL',
  },
};

export const outputRole = {
  name: 'MonetaryAdjustment-Approver',
  id: 10,
};

export const transactionCode = {
  code: 'ABC345',
  description: 'Este código tx es de ...',
  role: 'MonetaryAdjustment-Approver',
};

export const outputTransactionCode = {
  ...transactionCode,
  id: '3dece020-eb39-40bf-8f69',
};

export const transactionCodes = [
  { code: 'ABC123', description: 'Transaction code 1', roles: ['Role 1'] },
  { code: 'DEF456', description: 'Transaction code 2', roles: ['Role 2'] },
];

export const outputTransactionCodes = [
  { code: 'ABC123', description: 'Transaction code 1', id: 1 },
  { code: 'DEF456', description: 'Transaction code 2', id: 2 },
];

export const outputFindCodesByRole = [
  {
    id: 4,
    name: 'GpotVerifier',
    __codes__: [
      {
        id: 2405,
        code: 'COU0012A',
        description:
          'COU0012A - Ajuste Débito por pago TD Dale! - Cargo a un Deposito Electrónico por compras E-commerce',
      },
      {
        id: 2406,
        code: 'COU0012R',
        description:
          'COU0012R - Reversión cargo a Deposito Electrónico por pago TD Dale! -  por compras E-commerce',
      },
    ],
  },
];
export const anError = {
  anError: {
    error: 'this is an error',
  },
};

export const code = {
  id: 2405,
  code: 'COU0012A',
  description:
    'COU0012A - Ajuste Débito por pago TD Dale! - Cargo a un Deposito Electrónico por compras E-commerce',
};

export const mockGetAdjustmentQueryReportsDto: GetAdjustmentQueryReportsDto = {
  transactionCode: 'asdsad',
  adjustmentType: 'Debit',
  fromFile: true,
  depositNumber: '10222222',
  initialDate: null,
  endDate: null,
  limit: 0,
  offset: 0,
};

export const rolesFound = [
  {
    id: 2,
    name: 'MonetaryAdjustment-Capturer',
    __codes__: [
      {
        id: 129,
        code: 'CIN0005A',
        description:
          'CIN0005A - Ajuste crédito por transferencia: INTRASOLUCION- Con Abono a un Deposito Electrónico',
      },
      {
        id: 130,
        code: 'CIN0005R',
        description:
          'CIN0005R - Reversión abono a Deposito Electrónico  por Transferencia: INTRASOLUCION- (Cargo al Dep)',
      },
    ],
  },
  {
    id: 3,
    name: 'MonetaryAdjustment-Validator',
    __codes__: [
      {
        id: 129,
        code: 'CIN0005A',
        description:
          'CIN0005A - Ajuste crédito por transferencia: INTRASOLUCION- Con Abono a un Deposito Electrónico',
      },
      {
        id: 130,
        code: 'CIN0005R',
        description:
          'CIN0005R - Reversión abono a Deposito Electrónico  por Transferencia: INTRASOLUCION- (Cargo al Dep)',
      },
    ],
  },
  {
    id: 1,
    name: 'MonetaryAdjustment-Approver',
    __codes__: [
      {
        id: 129,
        code: 'CIN0005A',
        description:
          'CIN0005A - Ajuste crédito por transferencia: INTRASOLUCION- Con Abono a un Deposito Electrónico',
      },
      {
        id: 130,
        code: 'CIN0005R',
        description:
          'CIN0005R - Reversión abono a Deposito Electrónico  por Transferencia: INTRASOLUCION- (Cargo al Dep)',
      },
    ],
  },
];

export const rolesToFind = ['CIN0005A', 'CIN0005R'];

export const codesFound = {
  roles: rolesFound,
};

export const mappedRoles = [
  'MonetaryAdjustment-Capturer',
  'MonetaryAdjustment-Validator',
  'MonetaryAdjustment-Approver',
];
