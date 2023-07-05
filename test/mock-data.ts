import { SYSTEM_SOURCE } from '@dale/shared-nestjs/constants/error-sources';
import {
  DEFAULT_ERROR,
  ENTITY_ALREADY_EXIST,
  INVALID_PAYLOAD_ERROR,
  ENTITY_DOES_NOT_EXIST,
} from '@dale/shared-nestjs/constants/errors';
import {
  CustomException,
  GlobalErrorObjectType,
} from '@dale/shared-nestjs/custom-errors/custom-exception';
import { v4 as uuidv4 } from 'uuid';
import { IDNV_STATUS_PASSED } from '@dale/shared-nestjs/constants/status';
import {
  DEFAULT_REASON,
  ENTITY_ALREADY_EXISTS_DETAIL,
  ENTITY_ALREADY_EXISTS_REASON,
  ErrorCodes,
  USER_DOES_NOT_EXIST_DETAIL,
  ErrorObjectType,
  USER_DOES_NOT_EXIST_REASON,
  UPDATE_VALUES_MISSING_REASON,
  UPDATE_VALUES_MISSING_DETAIL,
  DEFAULT_DETAIL,
} from '@dale/shared-nestjs/constants/system-errors';
import serviceConfiguration from '../src/config/service-configuration';
import { User } from 'src/db/user/user.entity';

import { KafkaContext } from '@nestjs/microservices';
import { HeadersEvent } from 'src/shared/dto/events.dto';
import { UserEventDto } from 'src/modules/user/dto/user.dto';

export const mockUserId = uuidv4();
export const mockUser = {
  id: 'test-id',
  email: 'test-email',
  status: 'NEWLY_REGISTERED',
  city: 'pereira',
};
export const mockUserDob = {
  id: 'test-id',
  email: 'test-email',
  status: 'NEWLY_REGISTERED',
  dob: '2023-01-10',
  city: 'pereira',
};

export const mockDepositByUser = [
  {
    id: 'test-id',
    email: 'test-email',
    status: 'NEWLY_REGISTERED',
    accountNumber: 'test-id',
  },
];

export const addressMock = {
  buildingNumber: 'mock',
  street: 'mock',
  town: 'mock',
  postCode: 'mock',
  country: 'mock',
};

export const enrollmentNpDataResponse = {
  documentNumber: '51723568',
  documentType: '1',
  email: 'pepito@gmail.com',
  expeditionDate: 'string',
  firstName: 'PEPITO',
  firstSurname: 'PEDRAZA',
  gender: 1,
  phonePrefix: '+57',
  phoneNumber: '3115952184',
  validationData: {
    request: {
      requestedAt: '2023-02-21T01:12:54',
      responseCode: '14',
      securityCode: 'U4ZBDBD',
    },
    userData: {
      firstSurname: 'VILLEGAS',
      fullName: 'VILLEGAS TORRES JUAN DAVID AUGUSTO',
      name: 'JUAN DAVID AUGUSTO',
      secondSurname: 'TORRES',
      rut: 'false',
      validated: 'true',
      metadata: {
        age: {},
        demographicInfo: {},
      },
      documentData: {
        city: 'BARRANQUILLA',
        department: 'ATLANTICO',
        documentNumber: '00076710115',
        expeditionDate: '1996-08-28',
        status: '00',
      },
    },
  },
};

export const mockUserResponse = {
  id: 'test-id',
  email: 'test-email',
  firstName: 'mock',
  lastName: 'mock',
  documentType: 2,
  documentNumber: '123456',
  phoneNumber: 'mock',
  dob: '2023-01-10',
  address: addressMock,
  status: 'NEWLY_REGISTERED',
  riskProfile: 'mock',
  phoneNumberVerified: false,
  personType: '1',
  createAt: '2023-01-12T00:21:22.617Z',
  createAtUTC: '2023-01-12T00:21:22.617Z',
  updateAt: '2023-01-12T00:21:22.617Z',
  updateAtUTC: '2023-01-12T00:21:22.617Z',
  accountsNumber: ['000000123780'],
};

export const mockDepositResponse = {
  id: 1,
  accountNumber: '000000123780',
  status: 1,
  updateAt: '2023-01-17T19:47:53.060Z',
  updateAtUTC: '2023-01-17T19:47:53.060Z',
  user: {
    id: 'test-id',
    email: 'test-email',
    firstName: 'mock',
    lastName: 'mock',
    documentType: 2,
    documentNumber: '123456',
    phoneNumber: 'mock',
    dob: '2023-01-10',
    address: addressMock,
    status: 'NEWLY_REGISTERED',
    riskProfile: 'mock',
    //trackingId: 'test-id',
    phoneNumberVerified: false,
    personType: '1',
    createAt: '2023-01-12T00:21:22.617Z',
    createAtUTC: '2023-01-12T00:21:22.617Z',
    updateAt: '2023-01-12T00:21:22.617Z',
    updateAtUTC: '2023-01-12T00:21:22.617Z',
  },
};

export const mockUserServiceResponse = {
  id: 'test-id',
  email: 'test-email',
  firstName: 'mock',
  lastName: 'mock',
  documentType: 2,
  documentNumber: '123456',
  phoneNumber: 'mock',
  accountsNumber: ['000000123780'],
  dob: '2023-01-10',
  address: addressMock,
  status: 'NEWLY_REGISTERED',
  riskProfile: 'mock',
  //trackingId: 'test-id',
  phoneNumberVerified: false,
  personType: '1',
  createAt: '2023-01-12T00:21:22.617Z',
  createAtUTC: '2023-01-12T00:21:22.617Z',
  updateAt: '2023-01-12T00:21:22.617Z',
  updateAtUTC: '2023-01-12T00:21:22.617Z',
};

export const mockUpdateUserNew = {
  email: 'test-email',
  firstName: 'test-name',
  lastName: 'mock',
  phoneNumber: 'mock',
  dob: new Date('2023-01-10'),
  address: addressMock,
  status: 'NEWLY_REGISTERED',
  riskProfile: 'mock',
  trackingId: 'mock',
  phoneNumberVerified: false,
};

export const UpdatePhoneNumberMock = {
  userId: 'test-id',
  phoneNumber: 'mock',
  trackingId: 'mock',
};

export const UpdateDeviceMock = {
  userId: 'test-id',
  deviceId: 'mock',
  trackingId: 'mock',
};

export const UpdatePhoneNumberResponseMock = {
  requestId: 'mock',
};

export const AddUserDepositMock = {
  userId: 'test-id',
  accountNumber: 'mock',
  trackingId: 'mock',
};

export const mockUserFavorite = {
  id: '5e063e90-4c31-410a-b239-a46272685d48',
  userId: '882744c6-6cf2-4de3-aacd-22d69310240d',
  favoriteAlias: 'dev',
  phoneNumber: '3103230824',
};
export const mockUserFavoriteQuery = {
  where: {
    userId: '882744c6-6cf2-4de3-aacd-22d69310240d',
    favoriteAlias: 'dev',
    phoneNumber: '3103230824',
  },
};

export const mockUserFavoriteCreate = {
  id: '5e063e90-4c31-410a-b239-a46272685d47',
  userId: '882744c6-6cf2-4de3-aacd-22d69310240d',
  favoriteAlias: 'dev',
  phoneNumber: '3103230824',
};

export const mockQueryFavorite = `
    (SELECT "Favorite"."id", "Favorite"."user_id" AS "userId", "Favorite"."favorite_alias" AS "favoriteAlias",
    "Favorite"."phone_number" AS "phoneNumber"
    FROM "favorites"  "Favorite"
    WHERE ("Favorite"."user_id" = '882744c6-6cf2-4de3-aacd-22d69310240d')
    AND "Favorite"."favorite_alias" ILIKE '%%')
    UNION
    (SELECT "Favorite"."id", "Favorite"."user_id" AS "userId", "Favorite"."favorite_alias" AS "favoriteAlias",
    "Favorite"."phone_number" AS "phoneNumber"
    FROM "favorites"  "Favorite"
    WHERE ("Favorite"."user_id" = '882744c6-6cf2-4de3-aacd-22d69310240d')
    AND "Favorite"."phone_number" ILIKE '%%')
    ORDER BY "favoriteAlias" ASC
    LIMIT 1 OFFSET 0`;

export const mockUserFavoriteSuccessDeleted = {
  data: {
    code: 'MUS008',
    message: 'Hemos eliminado este contacto de tus favoritos.',
  },
  error: null,
};
export const mockUserFavoriteFailedDeleted = {
  affected: 1,
};
export const mockUserFavoriteFailedNoExitDeleted = {
  data: null,
  error: {
    code: 'ACS000',
    message: 'Favorito no existe',
  },
};
export const mockTestUserRegistered: User = {
  id: 'test-id',
  email: 'test-email',
  documentNumber: '11111111111',
  documentType: '1',
  firstName: 'Mockarlos',
  secondName: 'Mockevin',
  username: '3115952184',
  firstSurname: 'Mocklina',
  secondSurname: 'Anselmock',
  phoneNumber: '3115952184',
  phonePrefix: '57',
  externalId: '300000003263806',
  externalNumber: '52228',
  bPartnerId: '2',
  enrollmentId: '4352f9e5-525d-47dd-99a3-6b9d8ed1fe88',
  deviceId: '12345abcdef',
  gender: 1,
  userGender: 2,
};
export const mockEventMessage = {
  userId: 'test-id',
  idnvStatus: 'KYC_CHECKS_PASSED',
  riskProfile: 'risk-profile-low',
  trackingId: 'test-tracking-id',
};
export const mockUserDoesNotExistsError: ErrorObjectType = {
  source: serviceConfiguration().service.name,
  code: ErrorCodes.USER_DOES_NOT_EXIST_CODE,
  reason: USER_DOES_NOT_EXIST_REASON,
  details: USER_DOES_NOT_EXIST_DETAIL,
};
export const mockErrorUserNotExist400 = {
  message: ENTITY_DOES_NOT_EXIST,
  statusCode: 400,
  errors: [mockUserDoesNotExistsError],
};
export const mockErrorUserNotExist404 = {
  message: ENTITY_DOES_NOT_EXIST,
  statusCode: 404,
  errors: [mockUserDoesNotExistsError],
};
export const mockTestEmail = {
  email: 'test-email',
};
export const mockUpdateUser = {
  email: 'test-email',
  firstName: 'test-name',
  trackingId: 'test-tracking-id',
};
export const mockErrorCode = {
  code: '23505',
};

export const mockScreeningCheck = {
  userId: '',
  searchId: '532985782',
  matchStatus: 'no_match',
  riskLevel: 'unknown',
};
export const mockEntityAlreadyExistsError: ErrorObjectType = {
  source: SYSTEM_SOURCE,
  code: ErrorCodes.ENTITY_ALREADY_EXISTS_CODE,
  reason: ENTITY_ALREADY_EXISTS_REASON,
  details: ENTITY_ALREADY_EXISTS_DETAIL,
};
export const mockExpectedErrorObject409: GlobalErrorObjectType = {
  message: ENTITY_ALREADY_EXIST,
  statusCode: 409,
  errors: [mockEntityAlreadyExistsError],
};

export const mockExceptionError: GlobalErrorObjectType = {
  message: 'test-error',
  statusCode: 500,
  errors: [
    {
      code: ErrorCodes.DEFAULT_CODE,
      reason: DEFAULT_REASON,
      source: '',
      details: USER_DOES_NOT_EXIST_DETAIL,
    },
  ],
};
export const mockException = new CustomException(mockExceptionError);
export const mockMaskedUserId = 'mock-masked-value-for-user-id';
export const mockTrackingId = 'mock-id';
export const mockError = new Error('test-error');
export const mockDefaultError: ErrorObjectType = {
  source: SYSTEM_SOURCE,
  code: ErrorCodes.DEFAULT_CODE,
  reason: DEFAULT_REASON,
  details: DEFAULT_DETAIL,
};
export const mockExpectedErrorObject500: GlobalErrorObjectType = {
  message: DEFAULT_ERROR,
  statusCode: 500,
  errors: [mockDefaultError],
};

export const mockEntityUpdateValuesMissingError: ErrorObjectType = {
  source: SYSTEM_SOURCE,
  code: ErrorCodes.UPDATE_VALUES_MISSING_CODE,
  reason: UPDATE_VALUES_MISSING_REASON,
  details: UPDATE_VALUES_MISSING_DETAIL,
};
export const mockExpectedErrorObject400: GlobalErrorObjectType = {
  message: INVALID_PAYLOAD_ERROR,
  statusCode: 400,
  errors: [mockEntityUpdateValuesMissingError],
};
export const mockStatusMessage = {
  userId: mockUserId,
  idnvStatus: IDNV_STATUS_PASSED,
  riskProfile: 'risk_profile_low',
  trackingId: 'abc',
};
export const mockUserStatus = {
  id: mockUserId,
  email: 'my-test-email-for-kafka@example.com',
};

export const mockUpdatePhoneNumberPayload = {
  userId: mockUserId,
  phoneNumber: '+919999999999',
  trackingId: mockTrackingId,
};

export const mockCheckResultSuccess = {
  dbConnection: true,
  kafkaConnection: true,
  message: 'User service is connected to User Database',
};

export const mockCheckResultError = {
  dbConnection: false,
  message: false,
  kafkaConnection: false,
};

export const mockCreateuserRequest = {
  documentNumber: '',
  documentType: '',
  enrollmentId: '',
  firstName: '',
  firstSurname: '',
  phoneNumber: '',
  username: '',
  email: '',
  phonePrefix: '',
  secondName: '',
  secondSurname: '',
  deviceId: '',
  gender: 1,
  userGender: 2,
};

export const headers = {
  Application: '',
  ChannelId: '',
  IpAddress: '',
  Timestamp: '',
  TransactionId: '',
  SessionId: '',
  UserAgent: '',
  ClientId: '',
  ClientIdType: '',
  OriginCellphone: '',
};

export const sqsHeadersMock = {
  application: '',
  channelId: '',
  ipAddress: '',
  timestamp: '',
  transactionId: '',
  sessionId: '',
  'user-agent': '',
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

export const updateUserEventRequest: UserEventDto = {
  bPartnerId: '2',
  enrollmentId: '4352f9e5-525d-47dd-99a3-6b9d8ed1fe88',
  externalId: 300000003263806,
  externalNumber: '52228',
  phoneNumber: '3115952184',
};

export const mockKafkaContext: KafkaContext = new KafkaContext([
  null,
  1,
  'topic',
  null,
  null,
]);

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

export const mockEventResponseFavorite = {
  message: 'Mensaje enviado exitosamente',
  httpStatusCode: 200,
};

export const mockFavorite = {
  userId: '0',
  favoriteAlias: 'test',
  phoneNumber: '123',
  clientId: '321',
  clientIdType: 'CC',
  originCellphone: '456',
};

export const mockResultFavorite = {
  code: '0',
  message: '',
  action: 'test',
};

export const mockUserResponseUpdateLocate = {
  data: 'Usuario actualizado correctamente',
};

export const mockUserUpdateLocate = {
  updateLocation: {
    city: 'viterbo',
    departament: 'caldas',
  },
  phoneNumber: '3701212124',
};
