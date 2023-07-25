import { AxiosError } from 'axios';
import { HttpStatus } from '@nestjs/common';
import { HeaderDTO } from '../src/shared/dto/header.dto';
import { MessageEvent } from '../src/dto/content.dto';
import { DetailtDeviceDataResponse } from '../src/providers/enrollment-natural-person/dto/device-response.dto';
import { BaseTransform } from '../src/providers/context/provider-context';
import type { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { KafkaContext } from '@nestjs/microservices';
import { KafkaMessage } from '@nestjs/microservices/external/kafka.interface';

export const ConfigurationGetEnrollmentDeviceByIdResponseDecrypt = {
  data: {
    device: {
      deviceId: 'fec9a323-18f3-49tb-ad62-46c20de7a032',
      deviceName: 'Mi Dispositivo',
      deviceVersion: '48.48.78',
      deviceAppInfo: 'Prueba',
      deviceOperativeSystem: 'MiPC',
    },
  },
};

export const dataRedisEncrypt =
  'U2132dsfdsgsfdujYTFEFsdGVkX1+TXyMI5nKOv0ftV+Dnt/haf2NFzHs+z1k7HVztzy+ti13CK9TFOc8rq4cGkgSOQTFbj3YpnlDETd88z9lvjIx55mVBWL//QzexJsrU0vX68F7Q3uwtm6COcaF9OGgJCzFEhNbB1QenEcCDjEbreesXaJ+FXpalB/FdsauiSDP=';

export const headers: HeaderDTO = {
  TransactionId: '',
  ChannelId: '',
  SessionId: '',
  Timestamp: new Date().toString(),
  IpAddress: '',
  Application: '',
  ApiVersion: 0,
};

export const deviceFieldsTramaResponse = {
  data: {
    device: {
      deviceId: 'fec9a323-18f3-49tb-ad62-46c20de7a032',
      deviceName: 'Mi Dispositivo',
      deviceVersion: '48.48.78',
      deviceAppInfo: 'Prueba',
      deviceOperativeSystem: 'MiPC',
    },
  },
};

export const deviceTramaResponse = {
  Field_K7_0110: '49tbad6246c20de7a032',
  Field_K7_0111: 'Mi Dispositivo',
  Field_K7_0112: '48.48.78',
  Field_K7_0113: '127.0.0.7',
  Field_K7_0118: 'Prueba',
  Field_K7_0119: 'MiPC',
  Field_K7_0132: 3186779266,
};

export const id = 'fec9a323-18f3-49tb-ad62-46c20de7a032';

export const externalExceptionResponse: AxiosError<DetailtDeviceDataResponse> =
  {
    response: {
      data: {
        error: {
          code: 'ENP071',
          description: 'Problemas internos, intente mas tarde',
        },
      },
      status: HttpStatus.FORBIDDEN,
      statusText: 'OK',
      headers: {},
      config: {},
    },
    config: {},
    isAxiosError: true,
    toJSON: null,
    name: '',
    message: '',
  };

export const internalServerExceptionResponse: AxiosError<DetailtDeviceDataResponse> =
  {
    response: {
      data: {},
      status: HttpStatus.FORBIDDEN,
      statusText: 'OK',
      headers: {},
      config: {},
    },
    config: {},
    isAxiosError: true,
    toJSON: null,
    name: '',
    message: '',
  };

export const configurationGetUserByAccountNumberResponseDecrypt = {
  data: {
    id: 'fec9a323-18f3-49tb-ad62-46c20de7a032',
    email: 'kamiilosky@yopmail.com',
    firstName: 'Camila',
    secondName: null,
    firstSurname: '*',
    secondSurname: null,
    documentType: 2,
    documentNumber: '1245334567',
    phoneNumber: '4708596340',
    username: '*',
    phonePrefix: '*',
    dob: null,
    address: {
      buildingNumber: '12',
      street: '1',
      town: 'Env',
      postCode: '54',
      country: 'Colombia',
    },
    status: 'ACTIVE',
    riskProfile: null,
    personType: 1,
    externalId: 52183,
    externalNumber: '*',
    bPartnerId: '*',
    enrollmentId: '4a43eewd-fd2e-44d6-a459-bce127a1hd77',
    createAt: '2023-02-23T00:44:10.427Z',
    createAtUTC: '2023-02-23T00:44:10.427Z',
    updateAt: '2023-02-23T00:47:34.315Z',
    updateAtUTC: '2023-02-23T00:44:10.427Z',
    accountsNumber: ['01420123730'],
  },
};

export const crmGetClient = {
  data: {
    PartyId: 123,
    PartyNumber: '52183',
    SalesProfileNumber: '123',
    SalesProfileStatus: 'ACTIVO',
    CurrencyCode: 'test',
    PartyStatus: 'test',
    CreatedBy: 'test',
    PartyType: 'test',
    CreationDate: '2023-02-21T19:46:36.001+00:00',
    LastUpdateDate: '2023-02-21T19:46:40.006+00:00',
    ContactName: 'test',
    MobileNumber: '123',
    FormattedWorkPhoneNumber: '123',
    RawWorkPhoneNumber: '123',
    EmailAddress: 'test@test.com',
    PrimaryAddressId: 123,
    PartyNumberKey: '123',
    SellToPartySiteId: 123,
    AddressNumber: '123',
    Country: 'CO',
    WorkPhoneContactPtId: '123',
    PersonDEO_dl_tipo_identificacion_c: 'CC',
    PersonDEO_dl_numero_identificacion_c: 'test',
    PersonDEO_dl_genero_c: 'test',
    PersonDEO_dl_fecha_expedicion_c: '2000-08-28',
    PersonDEO_dl_identificadfor_dale_1_c: '123',
    PersonDEO_dl_tipo_enrrolamiento_c: 'ordinario',
    links: [
      {
        rel: 'child',
        href: 'https://crm/crmRestApi/resources/1/child/PersonDEO_Deposito_c',
        name: 'PersonDEO_DepositosCollection_c',
        kind: 'collection',
      },
    ],
  },
};

export const crmGetProduct = {
  data: {
    items: [
      {
        Id: 123,
        CreatedBy: 'test',
        CreationDate: '2023-02-10',
        LastUpdateDate: '2023-02-10',
        RecordNumber: '123',
        PersonProfile_Id_c: 123,
        dl_estado_deposito_c: 'ACTIVO',
        dl_id_cliente_c: 'test',
        dl_no_deposito_c: '1234',
        links: [],
      },
    ],
    count: 1,
    hasMore: false,
    limit: 0,
    offset: 0,
    links: [],
  },
};
export const externalId = '52183';

export const accountNumber = '000000123780';

export const getUserErrorResponse = {
  data: {
    error: {
      code: 'MUS003',
      message: 'Usuario no encontrado',
    },
  },
  headers: {},
  config: {},
  status: 200,
  statusText: 'OK',
};

export const getClientErrorResponse = {
  code: 'MUS003',
  message: 'Cliente no encontrado',
};

export const getProductErrorResponse = {
  code: 'MUS003',
  message: 'Producto no encontrado',
};

export const mockCheckResultSuccess = {
  kafka: {
    kafkaConnection: true,
    message: 'Kafka ok',
  },
  kafkaPts: {
    kafkaPtsConnection: true,
    message: 'Kafka PTS ok',
  },
  redis: {
    redisConnection: true,
    message: 'Redis ok',
  },
};
export const mockCheckResultFailure = {
  kafka: {
    kafkaConnection: false,
  },
  kafkaPts: {
    kafkaPtsConnection: false,
  },
  redis: {
    redisConnection: 'Connection is closed.',
  },
};
export const mockEventObject: MessageEvent = {
  Offset: '13',
  MSG_ID: '01',
  RQ: {
    messageRQ: {
      digitalService: 'INT_TRAN_DO_DALE2',
      transactionId: '123',
      bankId: '123',
      orderer: {
        additionals: {
          ipAddress: '127.0.0.3',
          cus: 'TESTCUS',
        },
      },
      beneficiaries: [
        {
          account: {
            othersId: {
              identificationType: 'BANCO1',
              identificationId: '0000008',
            },
          },
        },
      ],
      additionals: {
        ipAddress: '127.0.0.1',
        cus: 'TESTCUS',
        beneficiaryDetails: {
          beneficiaryAccount: '0000000023',
          beneficiaryBankId: '0001',
        },
      },
    },
    securityRQ: {
      hostId: '127.0.0.7',
    },
  },
  CFO: {
    general: {
      transactionAmount: 60000,
      transactionType: 'INT_TRAN_DO_DALE2_PTS_TRANSFER_DO-IT-SCUR',
      transactionDetails: 'Prueba',
    },
    orderer: {
      account: {
        legacyId: {
          accountNumber: '000001',
          accountType: '01',
        },
        othersId: {
          identificationId: '2000000',
        },
      },
      additionals: {
        ordererBP: {
          name: 'Jhoon',
          secondName: '',
          lastName: 'Doe',
          cellPhone: '318-677-9266',
          phone: '318-677-9266',
          externalId: '52',
        },
        sourceDetails: {
          sourceAccount: '00000000256114372',
          sourceBankId: '0023',
          TypeProductOrigin: 'CCA',
        },
      },
    },
    beneficiaries: [
      {
        account: {
          legacyId: {
            accountNumber: '',
            accountType: '0',
          },
          othersId: {
            identificationId: '2000000',
          },
        },
        additionals: {
          beneficiary: {
            BP: {
              name: 'Ann',
              secondName: '',
              lastName: 'Doe',
              cellPhone: '3333333333',
              phone: '3333333333',
              externalId: '53',
            },
          },
          sourceDetails: {
            sourceAccount: '123456',
            sourceBankId: '123',
            TypeProductOrigin: 'SDA',
          },
        },
      },
    ],
    additionals: {
      userCustomMessage: 'message test',
      sourceDetails: {
        sourceAccount: 'accountID',
      },
      beneficiaryDetails: {
        beneficiaryAccount: 'beneficiaryAccount',
        beneficiaryBankId: '123',
      },
      cus: 'TESTCUS',
    },
  },
  RS: {
    headerRS: {
      msgId: 'b59a145f-28ed-4652-8b2d-bf79606ebc60',
      msgIdOrg: 'TranDaleD2_ST',
      timestamp: '2023-03-04T19:37:02Z',
    },
    statusRS: {
      code: '0',
      description: 'TRANSACCION EXITOSA',
    },
    messageRS: {
      responses: [
        {
          PTSId: 'P0',
          additionals: {
            sourceDetails: {
              sourceAccount: '0000011',
              sourceBankId: '0001',
            },
            S125_REF2: '000000000000000000000',
            S125_REF3: '                         ',
            S125_IDREG: '00000048',
            S125_TD1: '00',
            S125_DOC1: '000000111506445',
            S125_TD2: '00',
            S125_DOC2: '000043045245250',
            S125_VALTIT: '0',
            S125_TERMD: '09632',
            Convenio: {
              ConvPrevioCuenta: 'SUB_23_02_001',
              AplicaTarifaConvenio: true,
              AsignaNuevoConvenio: true,
              TransaccionDeSubsidio: true,
              CodigoSubsidioDale: '16',
              ConvenioAsignado: 'SUB_23_02_001',
              NombConvenio: 'SECRETARIA DISTRITAL DE HACIENDA DE BOGOTA',
            },
          },
          confirmations: [
            {
              ordinal: '10',
              data: {
                id: '5054',
                creationDate: '2023-03-14T14:37:01-05:00',
                amount: -60005.05,
                accountBalances: {
                  totalBalance: 2663802.69,
                },
                transactionDetails: {
                  transactionChannelKey: '8a44565283f5db280183f68aec5e486d',
                  transactionChannelId: 'COU0003',
                },
              },
            },
            {
              ordinal: '50',
              data: {
                id: '5055',
                creationDate: '2023-03-14T14:37:01-05:00',
                amount: -10,
                accountBalances: {
                  totalBalance: 2663792.69,
                },
                transactionDetails: {
                  transactionChannelKey: '8a44565283f5db280183f68aec5e486d',
                  transactionChannelId: 'COU0003',
                },
              },
            },
            {
              ordinal: '50',
              data: {
                id: '5056',
                creationDate: '2023-03-14T14:37:01-05:00',
                amount: -1.9,
                accountBalances: {
                  totalBalance: 2663790.79,
                },
                transactionDetails: {
                  transactionChannelKey: '8a44565283f5db280183f68aec5e486d',
                  transactionChannelId: 'COU0003',
                },
              },
            },
            {
              ordinal: '10',
              data: {
                id: '5057',
                creationDate: '2023-03-14T14:37:02-05:00',
                amount: 60005.05,
                accountBalances: {
                  totalBalance: 248857.16,
                },
                transactionDetails: {
                  transactionChannelKey: '8a44565283f5db280183f68aec5e486d',
                  transactionChannelId: 'COU0003',
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export const mockEventObjectReverseOrdinal = {
  ordinal: '120',
  operation:
    'INT_TRAN_DO_D2D1_PTS_TRANSFER_DO-IT-SCUR.TRANSFERENCIA_INTERNA.REVERSE_VAT4',
  postingId: '2b00000-0000-0000-0000-aaaaaaaaaaaa',
  confirmationNumber: '45394',
  data: {
    encodedKey: '888888888888888888888888888',
    id: '45394',
    paymentOrderId: '19634',
    creationDate: '2023-05-31T10:24:23-05:00',
    valueDate: '2023-05-31T10:24:23-05:00',
    bookingDate: '2023-05-31T10:24:23-05:00',
    notes:
      'Prueba receptor bloqueado  Canal~IVA1001R~Cuenta Ord.~2000376~ Cuenta Ben.~000000126465 ~Sujeto ~ORDERER~ Concepto ~TAX~App_Mobile_IN-888888888888888888888888888-20230531',
    parentAccountKey: '888888888888888888888888888',
    type: 'DEPOSIT',
    amount: 4.75,
    currencyCode: 'COP',
    affectedAmounts: {
      fundsAmount: 4.75,
      interestAmount: 0,
      feesAmount: 0,
      overdraftAmount: 0,
      overdraftFeesAmount: 0,
      overdraftInterestAmount: 0,
      technicalOverdraftAmount: 0,
      technicalOverdraftInterestAmount: 0,
      fractionAmount: 0,
    },
    taxes: {},
    accountBalances: {
      totalBalance: 328201.96,
    },
    userKey: '888888888888888888888888888',
    terms: {
      interestSettings: {},
      overdraftInterestSettings: {},
      overdraftSettings: {},
    },
    transactionDetails: {
      transactionChannelKey: '888888888888888888888888888',
      transactionChannelId: 'IVA1001R',
    },
    transferDetails: {},
    fees: [],
    _additionalDetails: {
      linkedTransactionId: '19634',
    },
  },
  roundId: '1',
  responseType: 'ONLINE',
  errorCode: '0',
};
export const mockGetHead = {
  Field_90001: 'MFI-K7-002',
  Field_BYTEI: 'ByteI',
  Field_CONSTANN: 'N',
  Field_SISTEMINUTE: 37,
  Field_VWJEFECHAA: 2023,
  Field_VWJEFECHAD: 14,
  Field_VWJEFECHAM: 3,
  Field_VWJEHORA: 14,
  Field_VWJETECOD: '08647',
  Field_VWJEUSER: 'K7',
};
export const mockGetClientOrigin = {
  clientOrigin: {
    Field_K7_0001: '123',
    Field_K7_0002: 'N',
    Field_K7_0003: 'CC',
    Field_K7_0004: 'test',
    Field_K7_0005: 'test',
    Field_K7_0006: 'test@test.com',
    Field_K7_0007: '123',
    Field_K7_0008: '',
    Field_K7_0009: 20230221,
    Field_K7_0010: 0,
    Field_K7_0011: 20000828,
    Field_K7_0012: '00',
    Field_K7_0013: '01',
    Field_K7_0014: 'CO',
    Field_K7_0015: '',
    Field_K7_0016: '',
    Field_K7_0017: '',
    Field_K7_0018: '5',
    Field_K7_0019: 0,
    Field_K7_0020: 20230221,
    Field_K7_0021: 0,
    Field_K7_0022: 0,
    Field_K7_0023: 0,
    Field_K7_0024: 0,
    Field_K7_0025: '',
    Field_K7_0026: '',
    Field_K7_0027: 't',
    Field_K7_0028: 0,
    Field_K7_0029: '',
    Field_K7_0030: '',
  },
  links: [
    {
      rel: 'child',
      href: 'https://crm/crmRestApi/resources/1/child/PersonDEO_Deposito_c',
      name: 'PersonDEO_DepositosCollection_c',
      kind: 'collection',
    },
  ],
  tipo_enrrolamiento: '02',
};
export const mockGetClientDestination = {
  clientDestination: {
    Field_K7_0031: '123',
    Field_K7_0032: 'CC',
    Field_K7_0033: 'test',
    Field_K7_0034: 'test',
    Field_K7_0035: 'test@test.com',
    Field_K7_0036: '123',
    Field_K7_0037: '',
    Field_K7_0038: 20230221,
    Field_K7_0039: 0,
    Field_K7_0040: 20000828,
    Field_K7_0041: '00',
    Field_K7_0042: '01',
    Field_K7_0043: 'CO',
    Field_K7_0044: '',
    Field_K7_0045: '',
    Field_K7_0046: '',
    Field_K7_0047: '5',
    Field_K7_0048: 0,
    Field_K7_0049: 20230221,
    Field_K7_0050: 0,
    Field_K7_0051: 0,
    Field_K7_0052: 0,
    Field_K7_0053: 0,
    Field_K7_0054: '',
    Field_K7_0055: '',
    Field_K7_0056: 't',
    Field_K7_0057: 0,
    Field_K7_0058: '',
    Field_K7_0059: '',
  },
  links: [],
  tipo_enrrolamiento: '02',
};
export const mockGetProductOrigin = {
  productOrigin: {
    Field_K7_0060: 'DE2',
    Field_K7_0061: '',
    Field_K7_0062: '02',
    Field_K7_0063: '172002',
    Field_K7_0064: '2000000',
    Field_K7_0065: 20230210,
    Field_K7_0066: 2663802.69,
    Field_K7_0067: '5',
    Field_K7_0068: '',
    Field_K7_0069: 0,
    Field_K7_0070: 'CO',
    Field_K7_0071: 0,
  },
};
export const mockGetProductDestination = {
  productDestination: {
    Field_K7_0072: 'DE2',
    Field_K7_0073: '',
    Field_K7_0074: '02',
    Field_K7_0075: '172002',
    Field_K7_0076: '3333333333',
    Field_K7_0077: 20230210,
    Field_K7_0078: 248857.16,
    Field_K7_0079: '5',
    Field_K7_0080: '',
    Field_K7_0081: 0,
    Field_K7_0082: 'CO',
    Field_K7_0083: 0,
  },
};
export const crmGetClientDestination = {
  data: {
    PartyId: 123,
    Type: 'test',
    SalesProfileStatus: 'ACTIVO',
    CreationDate: '2023-02-21T19:46:36.001+00:00',
    LastUpdateDate: '2023-02-21T19:46:40.006+00:00',
    EmailAddress: 'test@test.com',
    Country: 'CO',
    ContactName: 'test',
    MobileNumber: '123',
    PersonDEO_dl_tipo_identificacion_c: 'CC',
    PersonDEO_dl_numero_identificacion_c: 'test',
    PersonDEO_dl_genero_c: 'test',
    PersonDEO_dl_fecha_expedicion_c: '2000-08-28',
    PersonDEO_dl_identificadfor_dale_1_c: '123',
    PersonDEO_dl_tipo_enrrolamiento_c: 'ordinario',
    links: [],
    PartyType: 'test',
  },
};
export const mockGetTransaction = {
  Field_K7_0084: '',
  Field_K7_0085: '',
  Field_K7_0086: '',
  Field_K7_0087: 20230314,
  Field_K7_0088: 20230315,
  Field_K7_0089: 193701,
  Field_K7_0090: 'P0',
  Field_K7_0091: '',
  Field_K7_0092: '',
  Field_K7_0093: 'COP',
  Field_K7_0094: 60000,
  Field_K7_0095: 'COP',
  Field_K7_0096: 60000,
  Field_K7_0097: 60000,
  Field_K7_0098: 'AP',
  Field_K7_0099: 'E',
  Field_K7_0100: '10',
  Field_K7_0101: 'Exitoso',
  Field_K7_0102: 'N',
  Field_K7_0103: 'CO',
  Field_K7_0104: '',
  Field_K7_0105: '',
  Field_K7_0106: '',
  Field_K7_0107: 0,
  Field_K7_0108: 0,
  Field_K7_0109: 0,
};

export const mockDeviceTransform = {
  Field_K7_0110: '49tbad6246c20de7a032',
  Field_K7_0111: 'Mi Dispositivo',
  Field_K7_0112: '48.48.78',
  Field_K7_0113: '127.0.0.3',
  Field_K7_0114: '',
  Field_K7_0115: 0,
  Field_K7_0116: '',
  Field_K7_0117: '',
  Field_K7_0118: 'Prueba',
  Field_K7_0119: 'MiPC',
  Field_K7_0120: '',
  Field_K7_0121: '',
  Field_K7_0122: '',
  Field_K7_0123: '',
  Field_K7_0124: '',
  Field_K7_0125: '',
  Field_K7_0126: '',
  Field_K7_0127: '',
  Field_K7_0128: '',
  Field_K7_0129: '',
  Field_K7_0130: '',
  Field_K7_0131: '',
  Field_K7_0132: 3186779266,
  Field_K7_0133: '',
  Field_K7_0134: '',
  Field_K7_0135: 0,
  Field_K7_0136: 0,
};
export const mockFutureUseTransform = {
  Field_K7_0137: '',
  Field_K7_0138: 0,
  Field_K7_0139: '',
  Field_K7_0140: '',
  Field_K7_0141: '',
  Field_K7_0142: '',
  Field_K7_0143: '0',
  Field_K7_0144: '',
  Field_K7_0145: '',
  Field_K7_0146: 0,
  Field_K7_0147: '',
  Field_K7_0148: 0,
  Field_K7_0149: 0,
  Field_K7_0150: '',
  Field_K7_0151: '',
  Field_K7_0152: 'ByteF',
};
export const mockBaseTransform: BaseTransform = {
  headTrama: mockGetHead,
  clientOriginTransform: mockGetClientOrigin.clientOrigin,
  clientDestinationTransform: mockGetClientDestination.clientDestination,
  productOriginTransform: mockGetProductOrigin.productOrigin,
  productDestinationTransform: mockGetProductDestination.productDestination,
  transactionTransform: mockGetTransaction,
  deviceTransform: mockDeviceTransform,
  futureUseTransform: mockFutureUseTransform,
};

export const mockResultGenerateStructure =
  'ByteIN14032023143708647K7        MFI-K7-002  123                                                                                                                             NCCtest                test                                                                                                                            test@test.com                                                   123                                                2023022100000000200008280001CO            5000000002023022100000000000000000000000000000000000000000000000000000000000000000000         t0   123                                                         CCtest                test                                                                                                                            test@test.com                                                   123                                                2023022100000000200008280001CO            5000000002023022100000000000000000000000000000000000000000000000000000000000000000000         t0   DE2   021720022000000               2023021000000002663802.695     00000000CO 00000000DE2   021720023333333333            2023021000000000248857.165     00000000CO 00000000                                             2023031420230315193701P0                         COP00000000000060000COP0000000000006000000000000000060000APE10    Exitoso   NCO                        00000000000049tbad6246c20de7a032Mi Dispositivo      48.48.78            127.0.0.3               000                                       Prueba                                                      MiPC                                                                                                                                                                                                                                                                                                            003186779266                     00000000000000                              00000000000000000                                                                                                                                  0                                                                     00000000000000000     000000000000000000000000000                                                                                                                                 ByteF';

export const MOCK_REDIS_CONFIG: RedisClientOptions = {
  store: redisStore,
  host: 'localhost',
  port: '6379',
  ttl: 5,
  auth_pass: 'token',
  tls: { servername: 'localhost' },
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

export const mockAdditionals = {
  beneficiaryDetails: {
    beneficiaryAccount: '3001233303',
  },
  sourceDetails: {
    sourceAccount: '3999999999',
  },
  userCustomMessage: 'message',
};
export const mockDateInformation = {
  year: '2023',
  month: '05',
  day: '09',
  hour: '14',
  minute: '48',
};

export const mockSmsKeys = [
  {
    Key: '#Name',
    Value: 'Diana',
  },
  {
    Key: '#Amount',
    Value: '$10.000,00',
  },
  {
    Key: '#Date',
    Value: '09/05/2023',
  },
  {
    Key: '#Time',
    Value: '14:48',
  },
];

export const mockSmsKeysNoName = [
  {
    Key: '#Name',
    Value: '',
  },
  {
    Key: '#Amount',
    Value: '$10.000,00',
  },
  {
    Key: '#Date',
    Value: '09/05/2023',
  },
  {
    Key: '#Time',
    Value: '14:48',
  },
];

export const mockCardBasic = {
  data: {
    cardId: 0,
    cardType: 0,
    cardNumber: '123',
    plasticName: 'test',
    statusId: 0,
    cardImage: 'https:',
    productId: '0',
    agreementId: 0,
    address: 'dir',
    cityName: 'Bogota',
    departmentDaneCode: '11',
    cityDaneCode: '0611',
  },
};

export const userId = '123';

export const getCardBasicResponseNotFound = {
  data: {},
  headers: {},
  config: {},
  status: 200,
  statusText: 'OK',
};

export const mockKafkaContext: KafkaContext = new KafkaContext([
  {
    offset: '1',
  } as KafkaMessage,
  // null,
  1,
  'topic',
  null,
  null,
]);

export const mockDataString = {
  CFO: {
    general: {
      transactionAmount: 1000,
    },
  },
  RS: {
    headerRS: {
      timestamp: '2023-03-07T19:10:02Z',
    },
    statusRS: {
      code: '407',
      description: 'TRANSACCION FALLIDA',
    },
    messageRS: {
      responses: [
        {
          PTSId: 'PI1',
          confirmations: [
            {
              data: '',
            },
          ],
        },
      ],
    },
  },
};
export const mockAuditResponse = {
  application: 'DALE 2.0',
  clientId: '20230200134',
  clientIdType: '2',
  channel: 'PTS INTEGRADOR',
  transactionId: '2334',
  requestId: 'b59a145f-28ed-4652-8b2d-bf79606ebc60',
  ipAddress: 'x.x.x.x',
  sessionId: '2334',
};

export const mockEmptyClientdestination = {
  Field_K7_0031: '',
  Field_K7_0032: '',
  Field_K7_0033: '',
  Field_K7_0034: '',
  Field_K7_0035: '',
  Field_K7_0036: '',
  Field_K7_0037: '',
  Field_K7_0038: 0,
  Field_K7_0039: 0,
  Field_K7_0040: 0,
  Field_K7_0041: '',
  Field_K7_0042: '',
  Field_K7_0043: '',
  Field_K7_0044: '',
  Field_K7_0045: '',
  Field_K7_0046: '',
  Field_K7_0047: '',
  Field_K7_0048: 0,
  Field_K7_0049: 0,
  Field_K7_0050: 0,
  Field_K7_0051: 0,
  Field_K7_0052: 0,
  Field_K7_0053: 0,
  Field_K7_0054: '',
  Field_K7_0055: '',
  Field_K7_0056: '',
  Field_K7_0057: 0,
  Field_K7_0058: '',
  Field_K7_0059: '',
};

export const mockEmptyProductDestination = {
  Field_K7_0072: '',
  Field_K7_0073: '',
  Field_K7_0074: '',
  Field_K7_0075: '',
  Field_K7_0076: '',
  Field_K7_0077: 0,
  Field_K7_0078: 0,
  Field_K7_0079: '',
  Field_K7_0080: '',
  Field_K7_0081: 0,
  Field_K7_0082: 'CO',
  Field_K7_0083: 0,
};

export const mockEventReverseIntraD2D2Object: MessageEvent = {
  ...mockEventObject,
  RS: {
    headerRS: {
      msgId: 'b59a145f-28ed-4652-8b2d-bf79606ebc61',
      msgIdOrg: 'TranDaleD2_S2',
      timestamp: '2023-03-04T19:37:05Z',
    },
    statusRS: {
      code: '0',
      description: 'TRANSACCION EXITOSA',
    },
    messageRS: {
      responses: [
        {
          PTSId: 'P132',
          additionals: {
            sourceDetails: {
              sourceAccount: '0000012',
              sourceBankId: '0002',
            },
            S125_REF2: '0000000000000000000',
            S125_REF3: '                         ',
            S125_IDREG: '00000238',
            S125_TD1: '000',
            S125_DOC1: '000000111505',
            S125_TD2: '00',
            S125_DOC2: '000043045240',
            S125_VALTIT: '0',
            S125_TERMD: '09632',
          },
          confirmations: [
            {
              ordinal: '10',
              data: {
                id: '5054',
                creationDate: '2023-03-14T14:37:01-05:00',
                amount: -60005.05,
                accountBalances: {
                  totalBalance: 2663802.69,
                },
                transactionDetails: {
                  transactionChannelKey: '8a44565283f5db280183f68aec5e486d',
                  transactionChannelId: 'COU0003',
                },
              },
            },
            {
              ordinal: '150',
              data: {
                id: '5057',
                creationDate: '2023-03-14T14:37:02-05:00',
                amount: 60005.05,
                accountBalances: {
                  totalBalance: 248857.16,
                },
                transactionDetails: {
                  transactionChannelKey: '8a44565283f5db280183f68aec5e486d',
                  transactionChannelId: 'COU0003R',
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export const mockCbWithdrawalAdditionalDetails = [
  {
    key: 'branch_type',
    value: 'CB',
  },
  {
    key: 'type',
    value: 'retiro_cb_otp',
  },
];

export const mockCashoutCbBaseEvent = {
  timestamp: '2023-06-21T12:06:35-05:00',
  details: [
    { key: 'key', value: 'value' },
    { key: 'date_transaction', value: '2023-06-21T12:06:35-05:00' },
  ],
};

export const mockCashinPSEBaseEvent = {
  timestamp: '2023-06-21T12:06:35-05:00',
  details: [
    { key: 'key', value: 'value' },
    { key: 'date_transaction', value: '2023-06-21T12:06:35-05:00' },
  ],
};

export const mockTMACashinEvent = [
  {
    key: 'reference1',
    value: '',
  },
  {
    key: 'reference2',
    value: '000000000000000000000',
  },
  {
    key: 'reference3',
    value: '                         ',
  },
  {
    key: 'type_pay',
    value: 'subsidio',
  },
  {
    key: 'assing_new_aggrement',
    value: true,
  },
  {
    key: 'code_agreement_dale',
    value: '16',
  },
  {
    key: 'agreement_assigned',
    value: 'SUB_23_02_001',
  },
  {
    key: 'name_agreement',
    value: 'SECRETARIA DISTRITAL DE HACIENDA DE BOGOTA',
  },
  {
    key: 'bank_origin',
    value: '0023',
  },
  {
    key: 'document_number_origin',
    value: '',
  },
  {
    key: 'account_type',
    value: 'SDA',
  },
];
