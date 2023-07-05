import { IErrorCodes } from '@dale/manage-errors-nestjs';
import { ErrorCodesEnum } from './error-codes.enum';

export const ErrorCodeMessages: IErrorCodes[] = [
  {
    code: ErrorCodesEnum.MUS000,
    title: 'Presentamos Fallas',
    icon: 'error',
    description: 'Intente más tarde',
    technicalDetail: {
      description: 'Ocurrió un erros desconocido y no esta controlado.',
      recommendations: 'Intentar mas tarde',
    },
  },
  {
    title: 'Presentamos Fallas',
    icon: 'error',
    description: 'la peticion tiene uno o varios errores',
    code: ErrorCodesEnum.MUS001,
    technicalDetail: {
      description: 'Formato de json enviado incorrecto.',
      recommendations: 'Intentar mas tarde',
    },
  },
  {
    title: 'Presentamos Fallas',
    icon: 'error',
    description: 'Campos ingresados incorrectos.',
    code: ErrorCodesEnum.MUS002,
    technicalDetail: {
      description: 'Los campos no cumplen con los requisitos',
      recommendations: 'Intentar mas tarde',
    },
  },
  {
    title: 'Presentamos Fallas',
    icon: 'error',
    description: 'El numero de deposito no existe.',
    code: ErrorCodesEnum.MUS003,
    technicalDetail: {
      description:
        'El deposito que esta consultando no existe en la base de datos de dale 2.0',
      recommendations: 'Intentar mas tarde',
    },
  },
  {
    title: 'Presentamos Fallas',
    icon: 'error',
    description: 'El numero de celular no existe.',
    code: ErrorCodesEnum.MUS004,
    technicalDetail: {
      description:
        'El numero celular que esta consultando no existe en la base de datos de dale 2.0',
      recommendations: 'Intentar mas tarde',
    },
  },
  {
    title: 'Presentamos Fallas',
    icon: 'error',
    description: 'El usuario no existe',
    code: ErrorCodesEnum.MUS005,
    technicalDetail: {
      description:
        'El usuario que esta consultando no existe en la base de datos de dale 2.0',
      recommendations: 'Intentar mas tarde',
    },
  },
  {
    title: 'Presentamos Fallas',
    icon: 'error',
    description: 'El favorito no existe.',
    code: ErrorCodesEnum.MUS006,
    technicalDetail: {
      description:
        'El favorito que esta consultando no existe en la base de datos de dale 2.0',
      recommendations: 'Intentar mas tarde',
    },
  },
  {
    title: 'Presentamos Fallas',
    icon: 'error',
    description: 'No se pudo eliminar el favorito.',
    code: ErrorCodesEnum.MUS007,
    technicalDetail: {
      description:
        'No se pudo eliminar el favorito en la base de datos de dale 2.0',
      recommendations: 'Intentar mas tarde',
    },
  },
  {
    title: 'Presentamos Fallas',
    icon: 'error',
    description: 'Hemos eliminado este contacto de tus favoritos.',
    code: ErrorCodesEnum.MUS008,
    technicalDetail: {
      description: 'Hemos eliminado este contacto de tus favoritos.',
      recommendations: 'Continue',
    },
  },
  {
    title: 'Presentamos Fallas',
    icon: 'error',
    description: 'Presentamos Fallas',
    code: ErrorCodesEnum.MUS009,
    technicalDetail: {
      description:
        'Ocurrio un error intentando almacenar el usuarion en la tabla user',
      recommendations: 'Intentar mas tarde',
    },
  },
  {
    title: 'Presentamos Fallas',
    icon: 'error',
    description: 'Presentamos Fallas',
    code: ErrorCodesEnum.MUS010,
    technicalDetail: {
      description:
        'Ocurrio un error inesperado en el metodo getUserInfoByEnrollmentId en enrollment service',
      recommendations: 'Intentar mas tarde',
    },
  },
  {
    title: 'Presentamos Fallas',
    icon: 'error',
    description: 'Presentamos Fallas',
    code: ErrorCodesEnum.MUS011,
    technicalDetail: {
      description:
        'el numero de telefono que se intenta almacenar es diferente al utilizado en el enrolamiento',
      recommendations: 'Intentar mas tarde',
    },
  },
  {
    title: 'Presentamos Fallas',
    icon: 'error',
    description: 'Presentamos Fallas',
    code: ErrorCodesEnum.MUS012,
    technicalDetail: {
      description:
        'Ocurrio un error inesperado en el metodo createUser en user service',
      recommendations: 'Intentar mas tarde',
    },
  },
  {
    title: 'Presentamos Fallas',
    icon: 'error',
    description: 'Presentamos Fallas',
    code: ErrorCodesEnum.MUS013,
    technicalDetail: {
      description:
        'Ocurrio un error inesperado en el metodo createUser en user controller',
      recommendations: 'Intentar mas tarde',
    },
  },
  {
    title: 'Presentamos Fallas',
    icon: 'error',
    description: 'Presentamos Fallas',
    code: ErrorCodesEnum.MUS014,
    technicalDetail: {
      description:
        'Ocurrio un error inesperado actualizar el usuario en base de datos updateUserByEmail',
      recommendations: 'Intentar mas tarde',
    },
  },
  {
    title: 'Presentamos Fallas',
    icon: 'error',
    description: 'Presentamos Fallas',
    code: ErrorCodesEnum.MUS015,
    technicalDetail: {
      description:
        'Ocurrio un error no controlado al crear el usuario en UserService',
      recommendations: 'Intentar mas tarde',
    },
  },
  {
    title: 'Presentamos Fallas',
    icon: 'error',
    description: 'Presentamos Fallas',
    code: ErrorCodesEnum.MUS016,
    technicalDetail: {
      description:
        'Ocurrio un error inesperado actualizar el usuario en base de datos updateUserById',
      recommendations: 'Intentar mas tarde',
    },
  },
  {
    title: 'Presentamos Fallas',
    icon: 'error',
    description: 'Presentamos Fallas',
    code: ErrorCodesEnum.MUS017,
    technicalDetail: {
      description:
        'Ocurrio un error inesperado actualizar el usuario en base de datos updateDevice',
      recommendations: 'Intentar mas tarde',
    },
  },
  {
    title: 'Presentamos Fallas',
    icon: 'error',
    description: 'Presentamos Fallas',
    code: ErrorCodesEnum.MUS018,
    technicalDetail: {
      description: 'Fallo al intentar publicar el log transaccional',
      recommendations: 'Revisar logs de user y conexión con SQS',
    },
  },
  {
    description: 'Presentamos Fallas',
    code: ErrorCodesEnum.MUS019,
    technicalDetail: {
      description:
        'Numero de telefono no se encuentra  registrado en nuestra base de datos',
      recommendations:
        'Revise que el numero ingresado se encuentre registrado en base de datos',
    },
  },
  {
    description: 'Presentamos Fallas',
    code: ErrorCodesEnum.MUS020,
    technicalDetail: {
      description: 'Error al intentar actualizar en base de datos ',
      recommendations: ' Revisar logs y conexión con base de datos ',
    },
  },
  {
    description: 'Presentamos Fallas',
    code: ErrorCodesEnum.MUS021,
    technicalDetail: {
      description:
        'Error al intentar conectar con el servicio de user en modulo de base de datos',
      recommendations: ' Revisar logs y revisar campos ingresados',
    },
  },
  {
    description: 'Presentamos Fallas',
    code: ErrorCodesEnum.MUS022,
    technicalDetail: {
      description:
        'Error en el  controlador de user en el metodo updateLocateUser ',
      recommendations: 'Revisar logs y revisar campos ingresados',
    },
  },
  {
    description: 'La informacion que estas buscando no se encontro',
    code: ErrorCodesEnum.MUS023,
    technicalDetail: {
      description:
        'UserId no se encuentra  registrado en nuestra base de datos',
      recommendations:
        'Revise que el UserId ingresado se encuentre registrado en base de datos',
    },
  },
  {
    description: 'Presentamos Fallas, intente mas tarde',
    code: ErrorCodesEnum.MUS024,
    technicalDetail: {
      description:
        'Error al intentar buscar informacion en base de datos en el metodo locationRequired',
      recommendations: ' Revisar logs y conexión con base de datos ',
    },
  },
  {
    description: 'Presentamos Fallas, intente mas tarde',
    code: ErrorCodesEnum.MUS025,
    technicalDetail: {
      description:
        'Error no controlado en el metodo  requirementsUser  en el archivo user.service',
      recommendations: ' Revisar logs y revisar campos ingresados',
    },
  },
];
