import { IErrorCodes } from '@dale/manage-errors-nestjs';
import { ErrorCodesEnum } from './error-codes.enum';

export const errorCodesLocal: IErrorCodes[] = [
  {
    code: ErrorCodesEnum.MON000,
    description: 'Ocurrió un error interno.',
    technicalDetail: {
      description: 'Ocurrió un error desconocido y no esta controlado.',
      recommendations: 'Intentar mas tarde',
    },
  },
  {
    code: ErrorCodesEnum.MON001,
    description: 'Ocurrió un error validando mensaje de evento Kafka.',
    technicalDetail: {
      description: 'Ocurrió un error validando mensaje de evento Kafka.',
      recommendations: 'Comparar mensaje de evento Kafka con DTO MessageEvent',
    },
  },
  {
    code: ErrorCodesEnum.MON002,
    description: 'Ocurrió un error validando datos.',
    technicalDetail: {
      description: 'Ocurrió un error validando datos.',
      recommendations:
        'Revisar constante errors del método validateData de utils/transform-class',
    },
  },
  {
    code: ErrorCodesEnum.MON003,
    description: 'Ocurrió un error obteniendo cliente origen.',
    technicalDetail: {
      description: 'Ocurrió un error obteniendo cliente origen.',
      recommendations: 'Revisar método getClientOrigin de monitor.service',
    },
  },
  {
    code: ErrorCodesEnum.MON004,
    description: 'Ocurrió un error obteniendo cliente destino.',
    technicalDetail: {
      description: 'Ocurrió un error obteniendo cliente destino.',
      recommendations: 'Revisar método getClientDestination de monitor.service',
    },
  },
  {
    code: ErrorCodesEnum.MON005,
    description: 'Ocurrió un error obteniendo producto origen.',
    technicalDetail: {
      description: 'Ocurrió un error obteniendo producto origen.',
      recommendations: 'Revisar método getProductOrigin de monitor.service',
    },
  },
  {
    code: ErrorCodesEnum.MON006,
    description: 'Ocurrió un error obteniendo producto destino.',
    technicalDetail: {
      description: 'Ocurrió un error obteniendo producto destino.',
      recommendations:
        'Revisar método getProductDestination de monitor.service',
    },
  },
  {
    code: ErrorCodesEnum.MON007,
    description: 'Ocurrió un error obteniendo transacción.',
    technicalDetail: {
      description: 'Ocurrió un error obteniendo transacción.',
      recommendations: 'Revisar método getTransaction de monitor.service',
    },
  },
  {
    code: ErrorCodesEnum.MON008,
    description: 'Ocurrió un error obteniendo dispositivo.',
    technicalDetail: {
      description: 'Ocurrió un error obteniendo dispositivo.',
      recommendations: 'Revisar método getDevice de monitor.service',
    },
  },
  {
    code: ErrorCodesEnum.MON009,
    description:
      'Ocurrió un error estableciendo valores en la estrategia para la transacción de tipo Intrasolución.',
    technicalDetail: {
      description:
        'Ocurrió un error estableciendo valores en la estrategia para la transacción de tipo Intrasolución.',
      recommendations: 'Revisar método doAlgorithm de intrasolution.strategy',
    },
  },
  {
    code: ErrorCodesEnum.MON010,
    description: 'Ocurrió un error consultando el proveedor de cliente origen.',
    technicalDetail: {
      description:
        'Ocurrió un error consultando el proveedor de cliente origen.',
      recommendations: 'Revisar método getClientOrigin de crm.service',
    },
  },
  {
    code: ErrorCodesEnum.MON011,
    description:
      'Ocurrió un error consultando el proveedor de cliente destino.',
    technicalDetail: {
      description:
        'Ocurrió un error consultando el proveedor de cliente destino.',
      recommendations: 'Revisar método getClientDestination de crm.service',
    },
  },
  {
    code: ErrorCodesEnum.MON012,
    description:
      'Ocurrió un error consultando el proveedor de producto origen.',
    technicalDetail: {
      description:
        'Ocurrió un error consultando el proveedor de producto origen.',
      recommendations: 'Revisar método getProductOrigin de crm.service',
    },
  },
  {
    code: ErrorCodesEnum.MON013,
    description:
      'Ocurrió un error consultando el proveedor de producto destino.',
    technicalDetail: {
      description:
        'Ocurrió un error consultando el proveedor de producto destino.',
      recommendations: 'Revisar método getProductDestination de crm.service',
    },
  },
  {
    code: ErrorCodesEnum.MON014,
    description:
      'Ocurrió un error al hacer la petición HTTP al proveedor de información.',
    technicalDetail: {
      description:
        'Ocurrió un error al hacer la petición HTTP al proveedor de información.',
      recommendations: 'Revisar método get de crm.service',
    },
  },
  {
    code: ErrorCodesEnum.MON015,
    description:
      'Ocurrió un error al dar formato a la información del producto.',
    technicalDetail: {
      description:
        'Ocurrió un error al dar formato a la información del producto.',
      recommendations: 'Revisar método formatDataProduct de crm.service',
    },
  },
  {
    code: ErrorCodesEnum.MON016,
    description: 'Ocurrió un error consultando el proveedor de dispositivo.',
    technicalDetail: {
      description: 'Ocurrió un error consultando el proveedor de dispositivo.',
      recommendations:
        'Revisar método getDeviceInformation de enrollment-np.service',
    },
  },
  {
    code: ErrorCodesEnum.MON017,
    description:
      'Ocurrió un error al hacer la petición HTTP al proveedor de información.',
    technicalDetail: {
      description:
        'Ocurrió un error al hacer la petición HTTP al proveedor de información.',
      recommendations: 'Revisar método httpGet de enrollment-np.service',
    },
  },
  {
    code: ErrorCodesEnum.MON018,
    description: 'Ocurrió un error consultando el proveedor de usuario.',
    technicalDetail: {
      description: 'Ocurrió un error consultando el proveedor de usuario.',
      recommendations: 'Revisar método getUser de user.service',
    },
  },
  {
    code: ErrorCodesEnum.MON019,
    description:
      'Ocurrió un error al hacer la petición HTTP al proveedor de información.',
    technicalDetail: {
      description:
        'Ocurrió un error al hacer la petición HTTP al proveedor de información.',
      recommendations: 'Revisar método httpGet de user.service',
    },
  },
  {
    code: ErrorCodesEnum.MON020,
    description: 'Ocurrió un error al enviar el mensaje a la cola sqs.',
    technicalDetail: {
      description: 'Ocurrió un error al enviar el mensaje a la cola sqs.',
      recommendations: 'Revisar método sendMessage de utils/aws-sqs',
    },
  },
  {
    code: ErrorCodesEnum.MON021,
    description:
      'Ocurrió un error al emitir el mensaje al topic kafka para enviar notificación SMS.',
    technicalDetail: {
      description: 'Ocurrió un error en el proveedor dale.',
      recommendations:
        'Revisar método sendSmsNotification de services/dale-notification.service',
    },
  },
  {
    code: ErrorCodesEnum.MON022,
    description: 'Ocurrió un error al consultar al proveedor de configuración.',
    technicalDetail: {
      description: 'Ocurrió un error en el proveedor dale.',
      recommendations:
        'Revisar método getDocumentTypeById de services/configuration.service',
    },
  },
  {
    code: ErrorCodesEnum.MON023,
    description: 'Ocurrió un error al consultar al proveedor de configuración.',
    technicalDetail: {
      description: 'Ocurrió un error en el proveedor dale.',
      recommendations:
        'Revisar método getGenders de services/configuration.service',
    },
  },
  {
    code: ErrorCodesEnum.MON024,
    description: 'Ocurrió un error al consultar al proveedor de configuración.',
    technicalDetail: {
      description: 'Ocurrió un error en el proveedor dale.',
      recommendations:
        'Revisar método getCodeGenderByProvider de services/configuration.service',
    },
  },
  {
    code: ErrorCodesEnum.MON025,
    description: 'Ocurrió un error al consultar al proveedor de configuración.',
    technicalDetail: {
      description: 'Ocurrió un error en el proveedor dale.',
      recommendations:
        'Revisar método getCrmAgreementCode de services/configuration.service',
    },
  },
  {
    code: ErrorCodesEnum.MON026,
    description: 'Ocurrió un error al consultar al proveedor de configuración.',
    technicalDetail: {
      description: 'Error de traduccion de DocumentTypeId para los proveedores',
      recommendations:
        'Revisar método getClientIdType de context-eventlog/eventlog-context',
    },
  },
  {
    code: ErrorCodesEnum.MON027,
    description: 'Ocurrió un error al darle formato a una fecha.',
    technicalDetail: {
      description: 'Ocurrió un error al darle formato a una fecha.',
      recommendations: 'Revisar método dateFormat de utils/date-format',
    },
  },
  {
    code: ErrorCodesEnum.MON028,
    description: 'Ocurrió un error al consultar al proveedor de CARD.',
    technicalDetail: {
      description: 'Ocurrió un error consultando el proveedor de card basic.',
      recommendations: 'Revisar método getCardAddress de card.service',
    },
  },
  {
    code: ErrorCodesEnum.MON029,
    description: 'Ocurrió un error al almacenar información en DynamoDB.',
    technicalDetail: {
      description:
        'Ocurrió un error al intentar insertar la metadata datos en DynamoDB.',
      recommendations:
        'Revisar método insertMetadata del proveedor dale dynamodb.service',
    },
  },
  {
    code: ErrorCodesEnum.MON030,
    description: 'Ocurrió un error al enviar el event log core a la cola sqs.',
    technicalDetail: {
      description: 'Ocurrió un error al enviar el mensaje a la cola sqs.',
      recommendations: 'Revisar método sendEventSQS de event-log-service',
    },
  },
];
