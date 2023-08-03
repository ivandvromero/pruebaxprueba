import { IErrorCodes } from '@dale/manage-errors-nestjs';
import { ErrorCodesEnum } from './error-codes.enum';

export const errorCodesLocal: IErrorCodes[] = [
  {
    code: ErrorCodesEnum.ACN001,
    title: 'Presentamos Fallas',
    icon: 'error',
    description: 'Intente más tarde',
    technicalDetail: {
      description:
        'Error no controlado en el metodo CreateAccountInPTS en Account service. posiblemente problemas al procesar el evento de topico de kafka',
      recommendations: 'Intentar mas tarde',
    },
  },
  {
    code: ErrorCodesEnum.ACN002,
    title: 'Presentamos Fallas',
    icon: 'error',
    description: 'Intente más tarde',
    technicalDetail: {
      description:
        'Error no controlado en el metodo CreateAccount en PTS service. posiblemente problemas de comunicacion con el servicio de PTS Mambu o un error inesperado',
      recommendations: 'Intentar mas tarde',
    },
  },
  {
    code: ErrorCodesEnum.ACN003,
    title: 'Presentamos Fallas',
    icon: 'error',
    description: 'Intente más tarde',
    technicalDetail: {
      description:
        'La cuenta que está intentando crear ya fue creada en Mambu PTS',
      recommendations: 'Intentar mas tarde',
    },
  },
  {
    code: ErrorCodesEnum.ACN004,
    title: 'Presentamos Fallas',
    icon: 'error',
    description: 'Intente más tarde',
    technicalDetail: {
      description:
        'Ocurrio un error intentando almacenar el usuarion en la tabla account',
      recommendations: 'Intentar mas tarde',
    },
  },
  {
    code: ErrorCodesEnum.ACN005,
    title: 'Presentamos Fallas',
    icon: 'error',
    description: 'Intente más tarde',
    technicalDetail: {
      description:
        'Error no controlado en el metodo CreateAccount en Account service. posiblemente problemas al procesar el evento de topico de kafka',
      recommendations: 'Intentar mas tarde',
    },
  },
  {
    code: ErrorCodesEnum.ACN006,
    title: 'Presentamos Fallas',
    icon: 'error',
    description: 'Intente más tarde',
    technicalDetail: {
      description:
        'Error no controlado en el metodo sendSmsNotification en DaleNotificationService. al emitir a kafka',
      recommendations: 'Intentar mas tarde',
    },
  },
  {
    code: ErrorCodesEnum.ACN007,
    description: 'Presentamos Fallas, intente mas tarde',
    technicalDetail: {
      description:
        'Error no controlado en AccountsController en el metodo accountLimitsByAccountId',
      recommendations: 'Revisar logs codigo ACN007 para detectar el problema',
    },
  },
  {
    code: ErrorCodesEnum.ACN008,
    description: 'Presentamos Fallas, intente mas tarde',
    technicalDetail: {
      description:
        'Error no controlado en AccountsService en el metodo getLimitsAccumulatorsByAccount',
      recommendations: 'Revisar logs codigo ACN008 para detectar el problema',
    },
  },
  {
    code: ErrorCodesEnum.ACN009,
    description: 'Presentamos Fallas, intente mas tarde',
    technicalDetail: {
      description: 'Error no controlado en PtsService en el metodo get',
      recommendations: 'Revisar logs codigo ACN009 para detectar el problema',
    },
  },
  {
    code: ErrorCodesEnum.ACN010,
    description: 'Presentamos Fallas, intente mas tarde',
    technicalDetail: {
      description:
        'Error al obtener informacion de la base de datos. posiblemente fallas de comunicacion con db',
      recommendations: 'Revisar logs codigo ACN010 para detectar el problema,',
    },
  },
  {
    code: ErrorCodesEnum.ACN011,
    description: 'Presentamos Fallas, intente mas tarde',
    technicalDetail: {
      description:
        'Error al obtener informacion de la base de datos. posiblemente fallas de comunicacion con db, metodo getOneAccountByUserIdAndAccountNumber',
      recommendations: 'Revisar logs codigo ACN011 para detectar el problema,',
    },
  },
  {
    code: ErrorCodesEnum.ACN012,
    description: 'Presentamos Fallas, intente mas tarde',
    technicalDetail: {
      description:
        'Error al actualizar la informacion de account: metodo: updateAccount',
      recommendations: 'Revisar logs codigo ACN012 para detectar el problema,',
    },
  },
  {
    code: ErrorCodesEnum.ACN013,
    description: 'Presentamos Fallas, intente mas tarde',
    technicalDetail: {
      description: 'Error no controlado en updateAccountEvent catch',
      recommendations: 'Revisar logs codigo ACN013 para detectar el problema,',
    },
  },
  {
    code: ErrorCodesEnum.ACN014,
    description: 'Presentamos Fallas, intente mas tarde',
    technicalDetail: {
      description: 'Fallo al intentar publicar el log transaccional',
      recommendations: 'Revisar logs de account y conexión con SQS',
    },
  },
  {
    code: ErrorCodesEnum.ACN015,
    description: 'Presentamos Fallas, intente mas tarde',
    technicalDetail: {
      description: 'Fallo al intentar traer data de enrollmentservice',
      recommendations: 'Revisar en enrollment id suministrado',
    },
  },
  {
    code: ErrorCodesEnum.ACN016,
    description: 'Presentamos Fallas, intente mas tarde',
    technicalDetail: {
      description:
        'Fallo al intentar traer el tipo de documento de configuration service',
      recommendations: 'Revisar en document id suministrado',
    },
  },
  {
    code: ErrorCodesEnum.ACN017,
    description: 'Presentamos Fallas, intente más tarde',
    technicalDetail: {
      description: 'Error no controlado en ADL Service metodo post',
      recommendations: 'Revisar logs codigo ACN017 para detectar el problema',
    },
  },
  {
    code: ErrorCodesEnum.ACN018,
    description: 'No encontramos lo que estas buscando',
    technicalDetail: {
      description:
        'No se encontro informacion de la cuenta en PTS con el accountId ingresado',
      recommendations:
        'Utilizar otro accountId que exista en el ambiente donde esta probando',
    },
  },
  {
    code: ErrorCodesEnum.ACN019,
    description: 'No encontramos lo que estas buscando',
    technicalDetail: {
      description:
        'No se encontro informacion de la cuenta en la base de datos Account con el userId ingresado',
      recommendations:
        'Utilizar otro userId que exista en el ambiente donde esta probando',
    },
  },
  {
    code: ErrorCodesEnum.ACN020,
    description: 'Intente más tarde',
    technicalDetail: {
      description:
        'Error no controlado en el metodo modifyLimits en PTS service. posiblemente problemas de comunicacion con el servicio de PTS Mambu o un error inesperado',
      recommendations: 'Intentar mas tarde',
    },
  },
  {
    code: ErrorCodesEnum.ACN021,
    description: 'Intente más tarde',
    technicalDetail: {
      description: 'No fue posible modificar los limites de la cuenta',
      recommendations: 'Intentar mas tarde',
    },
  },
  {
    code: ErrorCodesEnum.ACN022,
    description: 'Presentamos Fallas, intente mas tarde',
    technicalDetail: {
      description:
        'Error no controlado en AccountsService en el metodo modifyLimits',
      recommendations: 'Revisar logs codigo ACN020 para detectar el problema',
    },
  },
  {
    code: ErrorCodesEnum.ACN023,
    description: 'Presentamos Fallas, intente más tarde',
    technicalDetail: {
      description: 'No se pudo generar el archivo pdf del certificado',
      recommendations: 'Revisar logs codigo ACN020 para detectar el problema',
    },
  },
  {
    code: ErrorCodesEnum.ACN024,
    description: 'Presentamos Fallas, intente más tarde',
    technicalDetail: {
      description: 'Error de conexion con el servicio de ADL',
      recommendations: 'Intentar mas tarde',
    },
  },
  {
    code: ErrorCodesEnum.ACN025,
    description: 'Presentamos Fallas, intente más tarde',
    technicalDetail: {
      description: 'Error no controlado en el controlador getCertificate',
      recommendations: 'Revisar logs codigo ACN025 para detectar el problema',
    },
  },
];
