import { IErrorCodes } from '@dale/manage-errors-nestjs';
import { ErrorCodesEnum } from './error-codes.enum';

export const ErrorCodeMessages: IErrorCodes[] = [
  {
    code: ErrorCodesEnum.BOS001,
    description: 'En este momento presentamos fallas, intente mas tarde',
    technicalDetail: {
      description: `Error generado en getErrorCodedescriptions archivo error-code.helper.ts, esto sucede por que el codigo de error que se esta intentando buscar no esta mapeado en el archivo error-codes.local.ts`,
      recommendations: '',
    },
  },
  {
    code: ErrorCodesEnum.BOS002,
    title: 'Ajuste no encontrado.',
    description: 'El ajuste monetario no fue encontrado.',
    technicalDetail: {
      description:
        'Error no controlado al realizar consulta find en postgres. backoffice-service -> monetaryAdjustment -> repository -> findAdjustmentById',
      recommendations: '',
    },
  },
  {
    code: ErrorCodesEnum.BOS003,
    title: 'Error en la creación del ajuste.',
    description:
      'No se pudo crear el ajuste monetario, por favor intente más tarde.',
    technicalDetail: {
      description:
        'Error no controlado al realizar insert en postgres. backoffice-service -> monetaryAdjustment -> repository -> createAdjustment',
      recommendations: '',
    },
  },
  {
    code: ErrorCodesEnum.BOS004,
    title: 'No se encontraron ajustes.',
    description: 'En este momento presentamos fallas, intente mas tarde.',
    technicalDetail: {
      description:
        'Error no controlado al realizar operación find en postgres. backoffice-service -> monetaryAdjustment -> repository -> findAll',
      recommendations: '',
    },
  },
  {
    code: ErrorCodesEnum.BOS005,
    title: 'Error al actualizar el nivel de la transacción.',
    description: 'En este momento presentamos fallas, intente mas tarde.',
    technicalDetail: {
      description:
        'Error no controlado al realizar operación update en postgres. backoffice-service -> monetaryAdjustment -> repository -> patchTransactionLevel',
      recommendations: '',
    },
  },
  {
    code: ErrorCodesEnum.BOS006,
    title: 'Error al actualizar el estado de la transacción.',
    description: 'En este momento presentamos fallas, intente mas tarde.',
    technicalDetail: {
      description:
        'Error no controlado al realizar operación update en postgres. backoffice-service -> monetaryAdjustment -> repository -> patchAdjustmentState',
      recommendations: '',
    },
  },
  {
    code: ErrorCodesEnum.BOS007,
    title:
      'Error al hacer proceso de [verificación / aprobación] la transacción.',
    description: 'En este momento presentamos fallas, intente mas tarde.',
    technicalDetail: {
      description:
        'Error no controlado al realizar operación update en postgres. backoffice-service -> monetaryAdjustment -> repository -> adjustmentValidations',
      recommendations: '',
    },
  },
  {
    code: ErrorCodesEnum.BOS008,
    title: 'Error inesperado, por favor revisar los logs del servidor.',
    description: 'En este momento presentamos fallas, intente mas tarde.',
    technicalDetail: {
      description:
        'Error no controlado al realizar la operación backoffice-service -> monetaryAdjustment -> repository',
      recommendations: '',
    },
  },
  {
    code: ErrorCodesEnum.BOS009,
    title: 'Error al actualizar el estado del archivo de ajustes masivos.',
    description: 'En este momento presentamos fallas, intente mas tarde.',
    technicalDetail: {
      description:
        'Error no controlado al realizar operación update en postgres. backoffice-service -> monetaryAdjustment -> db -> file-monetary-adjustment -> repository -> patchAdjustmentState',
      recommendations: '',
    },
  },
  {
    code: ErrorCodesEnum.BOS010,
    title: 'Error al buscar archivo de ajustes masivos.',
    description:
      'No se han encontrado ajustes masivos con las propiedades seleccionadas.',
    technicalDetail: {
      description:
        'Error al no encontrar ajustes en backoffice-service -> monetaryAdjustment -> db -> file-monetary-adjustment -> repository -> findAllMassiveAdjustment',
      recommendations: '',
    },
  },
  {
    code: ErrorCodesEnum.BOS011,
    title: 'Error inesperado, por favor revisar los logs del servidor.',
    description: 'En este momento presentamos fallas, intente mas tarde.',
    technicalDetail: {
      description:
        'Error no controlado al realizar la operación backoffice-service -> monetaryAdjustment -> db -> file-monetary-adjustment -> repository',
      recommendations: '',
    },
  },
  {
    code: ErrorCodesEnum.BOS012,
    title: 'No se ha encontrado el ajuste masivos con el id proporcionado.',
    description:
      'No se ha encontrado el ajuste masivo con el id proporcionado.',
    technicalDetail: {
      description:
        'Error al no encontrar un ajuste en backoffice-service -> monetaryAdjustment -> db -> file-monetary-adjustment -> repository -> getOneMassive',
      recommendations: '',
    },
  },
  {
    code: ErrorCodesEnum.BOS013,
    title: 'Error en la creación del ajuste masivo.',
    description:
      'No se pudo crear el ajuste monetario masivo, por favor intente más tarde.',
    technicalDetail: {
      description:
        'Error no controlado al realizar insert en postgres. backoffice-service -> monetaryAdjustment -> db -> file-monetary-adjustment -> repository -> createMassiveAdjustment',
      recommendations: '',
    },
  },
  {
    code: ErrorCodesEnum.BOS014,
    title: 'Error inesperado, por favor revisar los logs del servidor.',
    description: 'En este momento presentamos fallas, intente mas tarde.',
    technicalDetail: {
      description:
        'Error no controlado al realizar la operación backoffice-service -> monetaryAdjustment -> db -> file-monetary-adjustment -> repository',
      recommendations: '',
    },
  },
  {
    code: ErrorCodesEnum.BOS015,
    title: 'Error al buscar la lista de archivos masivos.',
    description: 'En este momento presentamos fallas, intente mas tarde.',
    technicalDetail: {
      description:
        'Error no controlado al realizar la operación backoffice-service -> monetaryAdjustment -> db -> file-monetary-adjustment -> repository -> findAllMassiveAdjustment',
      recommendations: '',
    },
  },
  {
    code: ErrorCodesEnum.BOS016,
    title: 'Error al reprocesar el archivo.',
    description: 'En este momento presentamos fallas, intente mas tarde.',
    technicalDetail: {
      description:
        'El archivo seleccionado para reprocesar no se encuentra en estado fallido',
      recommendations: '',
    },
  },
  {
    code: ErrorCodesEnum.BOS017,
    title: 'Error al buscar transacciones.',
    description:
      'No se pueden buscar transacciones sin un parametro de busqueda.',
    technicalDetail: {
      description:
        'Se debe ingresar al menos un parametro de busqueda para buscar transacciones',
      recommendations: '',
    },
  },
  {
    code: ErrorCodesEnum.BOS018,
    title: 'Error al realizar la peticicon http.',
    description: 'Petición incorrecta',
    technicalDetail: {
      description: 'Error al realizar la petición http desde el http adapter',
      recommendations: '',
    },
  },
  {
    code: ErrorCodesEnum.BOS019,
    title: 'Error al buscar las tarjetas.',
    description: 'No se han encontrado tarjetas asociadas',
    technicalDetail: {
      description: 'No se han encontrado tarjetas asociadas',
      recommendations: '',
    },
  },
  {
    code: ErrorCodesEnum.BOS020,
    title: 'Error al buscar la persona natural.',
    description: 'No se ha encontrado el cliente con la información ingresada',
    technicalDetail: {
      description:
        'No se ha encontrado el cliente con la información ingresada',
      recommendations: '',
    },
  },
  {
    code: ErrorCodesEnum.BOS021,
    title: 'Cuenta del cliente no ha sido encontrada.',
    description: 'Cuenta buscada del cliente no ha sido encontrada',
    technicalDetail: {
      description: 'Cuenta buscada del cliente no ha sido encontrada',
      recommendations: '',
    },
  },
  {
    code: ErrorCodesEnum.BOS022,
    title: 'La cuenta o cliente no han sido encontrados.',
    description: 'El cliente o cuenta buscado no ha sido encontrado',
    technicalDetail: {
      description: 'El cliente o cuenta buscado no ha sido encontrado',
      recommendations: '',
    },
  },
  {
    code: ErrorCodesEnum.BOS023,
    title: 'No se han encontrado transacciones.',
    description:
      'No se ha encontrado transacciones con los parametros ingresados',
    technicalDetail: {
      description:
        'No se ha encontrado transacciones con los parametros ingresados',
      recommendations: '',
    },
  },
  {
    code: ErrorCodesEnum.BOS024,
    title: 'Codigo de transacción incorrecto.',
    description: 'El código ingresado no coincide con su rol',
    technicalDetail: {
      description: 'El código de transacción ingresado no coincidencon su rol',
      recommendations: '',
    },
  },
  {
    code: ErrorCodesEnum.BOS025,
    title: 'Codigo ingresado en el ajuste no se ha encontrado.',
    description:
      'El código del ajuste monetario no se ha encontrado en la base de datos',
    technicalDetail: {
      description:
        'El código del ajuste monetario no se ha encontrado en la base de datos',
      recommendations: '',
    },
  },
  {
    code: ErrorCodesEnum.BOS026,
    title: 'No se encontraron roles.',
    description: 'Error al buscar los roles',
    technicalDetail: {
      description: 'No se encontraron roles verifica logs',
      recommendations: '',
    },
  },
  {
    code: ErrorCodesEnum.BOS027,
    title: 'Id del rol ingresado incorrecto',
    description: 'No se puede encontrar usuario , id del rol incorrecto',
    technicalDetail: {
      description:
        'Error al obtener usuario, verifica el Id e intente nuevamente',
      recommendations: '',
    },
  },
  {
    code: ErrorCodesEnum.BOS028,
    title: 'No se encontraron roles con el id ingresado',
    description: 'No se puede encontrar roles , id incorrecto',
    technicalDetail: {
      description: 'Error al obtener rol, verifica el Id e intente nuevamente',
      recommendations: '',
    },
  },
  {
    code: ErrorCodesEnum.BOS029,
    title: 'No se encontraron correos',
    description: 'No se puede encontrar correos o nombres invalidos',
    technicalDetail: {
      description: 'Error al obtener correos, revisa logs',
      recommendations: '',
    },
  },
  {
    code: ErrorCodesEnum.BOS030,
    title: 'No se ha encontrado la secret key',
    description: 'No se ha encontrado la secret key',
    technicalDetail: {
      description: 'Error al buscar la secret key, revisa logs',
      recommendations: '',
    },
  },
  {
    code: ErrorCodesEnum.BOS031,
    title: 'No se ha podido reprocesar el ajuste masivo',
    description: 'No se ha podido reprocesar el ajuste masivo',
    technicalDetail: {
      description: 'No se ha podido reprocesar el ajuste masivo, revisa logs',
      recommendations: '',
    },
  },
  {
    code: ErrorCodesEnum.BOS032,
    title: 'Error al obtener token',
    description: 'No se ha obtenido el token',
    technicalDetail: {
      description: 'Error al obtener token, revisa logs',
      recommendations: '',
    },
  },
  {
    code: ErrorCodesEnum.BOS033,
    title: 'Error al setear token en cache',
    description: 'No se ha seteado el token en cache',
    technicalDetail: {
      description: 'Error al setear token en cache, revisa logs',
      recommendations: '',
    },
  },
  {
    code: ErrorCodesEnum.BOS034,
    title: 'Error al generar token',
    description: 'No se ha podido generar el token',
    technicalDetail: {
      description: 'Error al generar token, revisa logs',
      recommendations: '',
    },
  },
  {
    code: ErrorCodesEnum.BOS035,
    title: 'Error al borrar token',
    description: 'No se ha podido boorar el token',
    technicalDetail: {
      description: 'Error al borrar token, revisa logs',
      recommendations: '',
    },
  },
  {
    code: ErrorCodesEnum.BOS036,
    title: 'Error al realizar la petición a PTS',
    description: 'Error al realizar la petición a PTS token invalido',
    technicalDetail: {
      description: 'Error al realizar la petición a PTS token invalido',
      recommendations: '',
    },
  },
  {
    code: ErrorCodesEnum.BOS037,
    title: 'Error al consultar el tiempo de sesión en base de datos',
    description: 'Error al consultar el tiempo de sesión en base de datos',
    technicalDetail: {
      description:
        'Error al consultar el tiempo de sesión en base de datos, revisar logs',
      recommendations: '',
    },
  },
  {
    code: ErrorCodesEnum.BOS038,
    title: 'Error al crear tiempo de sesión',
    description: 'Error al crear tiempo de sesión',
    technicalDetail: {
      description: 'Error al crear tiempo de sesión, revisar logs',
      recommendations: '',
    },
  },
  {
    code: ErrorCodesEnum.BOS039,
    title: 'Error al consultar el rol',
    description: 'Error al consultar el rol',
    technicalDetail: {
      description: 'Error al consultar el rol, revisar logs',
      recommendations: '',
    },
  },
  {
    code: ErrorCodesEnum.BOS040,
    title: 'Error al actualizar tiempo de sesión',
    description: 'Error al actualizar tiempo de sesión',
    technicalDetail: {
      description: 'Error al actualizar tiempo de sesión, revisar logs',
      recommendations: '',
    },
  },
];
