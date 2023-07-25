import {
  MassiveMonetaryAdjustmentFileDto,
  AdjustmentQueryDto,
  GetArchiveMassiveDto,
  GetAdjustmentQueryReportsDto,
} from '@dale/monetary-adjustment/modules/monetary-adjustment/dto';
import {
  PaginationMassiveAdjustmentsResponse,
  PaginationRegisterAdjustmentsResponse,
} from '@dale/monetary-adjustment/shared/common';
import {
  TransactionType,
  AdjustmentReason,
  AdjustmentState,
} from '@dale/monetary-adjustment/shared/enums';

export const massiveAdjustmentDto: MassiveMonetaryAdjustmentFileDto = {
  fileName: 'originalFileName.xlsx',
  frontId: 'aFrontId',
  size: 1123,
  totalCredit: 2000,
  totalDebit: 2000,
  totalRecords: 4,
  consecutive: 0,
  adjustments: [
    {
      date: '22072022',
      depositNumber: '500000283487',
      amount: 2000,
      adjustmentType: TransactionType.CREDIT,
      transactionCode: 'COU0016R',
      transactionDescription: 'Ajuste Credito',
      fees: 0,
      vat: 0,
      gmf: 0,
      adjustmentReason: AdjustmentReason.AJUSTE_POR_RECLAMACION,
      responsible: 'KEDHNA',
    },
    {
      date: '22072022',
      depositNumber: '500000283487',
      amount: 2000,
      adjustmentType: TransactionType.DEBIT,
      transactionCode: 'COU0016R',
      transactionDescription: 'Ajuste Dedito',
      fees: 0,
      vat: 0,
      gmf: 0,
      adjustmentReason: AdjustmentReason.AJUSTE_POR_RECLAMACION,
      responsible: 'KEDHNA',
    },
  ],
};

export const newAdjustments = [
  {
    id: 'feed1103-0537-40c2-9fd4-1642ac983d5f',
    dateFile: '22072022',
    clientId: null,
    depositNumber: '500000283487',
    amount: 3000,
    adjustmentType: TransactionType.CREDIT,
    adjustmentState: AdjustmentState.PENDING,
    transactionLevel: 1,
    transactionCode: 'COU0016R',
    transactionDescription: 'Ajuste Credito',
    fees: 0,
    vat: 0,
    gmf: 0,
    createdAt: new Date('2023-04-04T00:37:01.471Z'),
    updatedAt: null,
    comment: null,
    isFromFile: true,
    adjustmentReason: AdjustmentReason.AJUSTE_POR_RECLAMACION,
    responsible: 'KEDHNA',
    transactionName: 'AMM - Ajuste crédito',
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
      updatedAt: [],
    },
  },
  {
    id: '5d0f0ecc-1a7d-4c12-b93e-10f06a087acg',
    dateFile: '22072022',
    clientId: null,
    depositNumber: '500000283487',
    amount: 5000,
    adjustmentType: TransactionType.DEBIT,
    adjustmentState: AdjustmentState.PENDING,
    transactionLevel: 1,
    transactionCode: 'COU0016R',
    transactionDescription: 'Ajuste Credito',
    fees: 0,
    vat: 0,
    gmf: 0,
    createdAt: new Date('2023-04-04T00:37:01.471Z'),
    updatedAt: null,
    comment: null,
    isFromFile: true,
    adjustmentReason: AdjustmentReason.AJUSTE_POR_RECLAMACION,
    responsible: 'KEDHNA',
    transactionName: 'AMM - Ajuste dédito',
  },
];

export const createMassiveAdjustmentResponse = {
  id: '7f7efe5e-6ba0-489c-8412-38672b354614',
  adjustmentState: AdjustmentState.PENDING,
  comment: null,
  createdAt: new Date('2023-04-04T00:37:01.471Z'),
  fileName: 'NombreDelArchivo.xlsx',
  formattedName: 'MASIVOMN030423143701.xlsx',
  frontId: 'aFrontId',
  hasError: false,
  size: 4151,
  totalCredit: 3000,
  totalDebit: 5000,
  totalRecords: 4,
  transactionLevel: 1,
  updatedAt: null,
  usersEmails: ['test@mail.com'],
  adjustments: newAdjustments,
};

export const mockedRoles = [
  'MonetaryAdjustment-Capturer',
  'MonetaryAdjustment-Validator',
  'MonetaryAdjustment-Approver',
];

export const failedMassiveAdjustmentResponse = {
  ...createMassiveAdjustmentResponse,
};

failedMassiveAdjustmentResponse.adjustmentState = AdjustmentState.FAILED;
failedMassiveAdjustmentResponse.adjustments[0].adjustmentState =
  AdjustmentState.FAILED;

export const firstAdjustment = {
  id: 'feed1103-0537-40c2-9fd4-1642ac983d5f',
  dateFile: '22072022',
  clientId: null,
  depositNumber: '500000283487',
  amount: 3000,
  adjustmentType: TransactionType.CREDIT,
  adjustmentState: AdjustmentState.PENDING,
  transactionLevel: 1,
  transactionCode: 'COU0016R',
  transactionDescription: 'Ajuste Credito',
  fees: 0,
  vat: 0,
  gmf: 0,
  createdAt: new Date('2023-04-04T00:37:01.471Z'),
  updatedAt: null,
  comment: null,
  isFromFile: true,
  adjustmentReason: AdjustmentReason.AJUSTE_POR_RECLAMACION,
  responsible: 'KEDHNA',
  transactionName: 'AMM - Ajuste crédito',
};

export const adjustmentWithRelations = {
  ...firstAdjustment,
  updateRegister: {
    id: 'anId',
    user: ['A Name'],
    userEmail: ['anEmail@test.com'],
    updatedAt: [
      new Date('Fri May 05 2023 12:23:33 GMT-0500 (hora estándar de Colombia)'),
    ],
  },
};

export const secondAdjustment = {
  id: '5d0f0ecc-1a7d-4c12-b93e-10f06a087acg',
  dateFile: '22072022',
  clientId: null,
  depositNumber: '500000283487',
  amount: 5000,
  adjustmentType: TransactionType.DEBIT,
  adjustmentState: AdjustmentState.PENDING,
  transactionLevel: 1,
  transactionCode: 'COU0016R',
  transactionDescription: 'Ajuste Credito',
  fees: 0,
  vat: 0,
  gmf: 0,
  createdAt: new Date('2023-04-04T00:37:01.471Z'),
  updatedAt: null,
  comment: null,
  isFromFile: true,
  adjustmentReason: AdjustmentReason.AJUSTE_POR_RECLAMACION,
  responsible: 'KEDHNA',
  transactionName: 'AMM - Ajuste dédito',
};

export const massiveAdjustmentResponseWithNewAdjustments =
  createMassiveAdjustmentResponse;

massiveAdjustmentResponseWithNewAdjustments.adjustments.push(firstAdjustment);
massiveAdjustmentResponseWithNewAdjustments.adjustments.push(secondAdjustment);

export const adjustmentQuery: AdjustmentQueryDto = {
  limit: 1,
  offset: 0,
};

export const getAllResponsePaginated = new PaginationMassiveAdjustmentsResponse(
  [createMassiveAdjustmentResponse],
  1,
  0,
  1,
);

export const getReportsPaginated = new PaginationRegisterAdjustmentsResponse(
  [adjustmentWithRelations],
  1,
  0,
  1,
);

export const dbCodesByRole = {
  id: 2,
  name: 'MonetaryAdjustment-Capturer',
  codes: [
    {
      id: 2,
      code: 'COU0001A',
      description:
        'COU0001A - Ajuste Débito por Transferencia con cargo (Débito) a un Deposito Electrónico y abono a cuentas Aval',
    },
    {
      id: 3,
      code: 'COU0001R',
      description:
        'COU0001R - Reversión cargo a Deposito Electrónico  por transferencia a cuentas Aval',
    },
    {
      id: 5,
      code: 'COU0002A',
      description:
        'COU0002A - Ajuste Débito por Transferencia con cargo a un Deposito Electrónico y abono a cuentas entidades NO Aval',
    },
    {
      id: 6,
      code: 'COU0002R',
      description:
        'COU0002R - Reversión cargo a Deposito Electrónico por transferencia a cuentas entidades NO Aval',
    },
    {
      id: 7,
      code: 'COU0003A',
      description:
        'COU0003A - Ajuste Débito por Transferencia INTRASOLUCION- Con Cargo a un Deposito Electrónico',
    },
    {
      id: 8,
      code: 'COU0003R',
      description:
        'COU0003R - Reversión cargo a Deposito Electrónico  por Transferencia: INTRASOLUCION-',
    },
  ],
};

export const email = 'anemail@test.com';

export const validator = 'validator@test.com';

export const massiveAdjustmentLevel2 = {
  ...createMassiveAdjustmentResponse,
  transactionLevel: 2,
};
export const adjustmentId = 'A massive adjustment id';

export const mockParamsArchive: GetArchiveMassiveDto = {
  id: 'testId',
  log: 'true',
};

export const sendMock = jest.fn();
export const setHeaderMock = jest.fn();
export const bufferMock = jest.fn as unknown as Buffer;

export const searchQuery: GetAdjustmentQueryReportsDto = {};

export const searchQueryWithParams: GetAdjustmentQueryReportsDto = {
  transactionCode: 'COU0016R',
  adjustmentType: TransactionType.DEBIT,
  fromFile: true,
  depositNumber: '500000283487',
  initialDate: new Date('2022-11-01T14:44:47-05:00'),
  endDate: new Date('2023-05-09T14:44:47-05:00'),
};
