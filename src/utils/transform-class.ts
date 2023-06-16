import { InternalServerExceptionDale } from '@dale/manage-errors-nestjs';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { ErrorCodesEnum } from '../shared/manage-errors/code-erros/error-codes.enum';
import {
  SalesProfileStatus,
  TipoEnrrolamiento,
  TransformParams,
} from '../shared/enum/transform-params';

export const setTranformData = (value, key): string => {
  return typeof value === 'string'
    ? value.padEnd(Number(TransformParams[key]), ' ')
    : value.toString().padStart(Number(TransformParams[key]), '0');
};

//Los campos fecha tendran formato AAAAMMDD
export const transformDate = (datetime): number => {
  const currentDate =
    typeof datetime === 'object' ? datetime : new Date(datetime);
  const dateNumber = currentDate.getUTCDate();
  const date = dateNumber < 10 ? '0' + dateNumber : dateNumber;
  const monthNumber = currentDate.getMonth() + 1;
  const month = monthNumber < 10 ? '0' + monthNumber : monthNumber;
  const year = currentDate.getUTCFullYear();
  const formatDate = `${year}${month}${date}`;
  return Number(formatDate);
};

//Los campos hora tendran formato HHMMSS
export const transformTime = (datetime): number => {
  const currentDate =
    typeof datetime === 'object' ? datetime : new Date(datetime);
  const hourNumber = currentDate.getHours();
  const hour = hourNumber < 10 ? '0' + hourNumber : hourNumber;
  const minuteNumber = currentDate.getMinutes();
  const minute = minuteNumber < 10 ? '0' + minuteNumber : minuteNumber;
  const secondNumber = currentDate.getSeconds();
  const second = secondNumber < 10 ? '0' + secondNumber : secondNumber;
  const formatDate = `${hour}${minute}${second}`;
  return Number(formatDate);
};

// Funcion que agrupa todos los errores generados por validate class-validator
export const mapErrorChildren = (errors, allConstraint = []): Array<any> => {
  if (errors.length) {
    for (const key in errors) {
      if (Object.prototype.hasOwnProperty.call(errors, key)) {
        const element = errors[key];
        if (element.constraints) {
          allConstraint.push(element.constraints);
        }
        mapErrorChildren(element.children, allConstraint);
      }
    }
  }
  return allConstraint;
};

export const validateData = async (dtoData, getData) => {
  const dto = plainToInstance(dtoData, getData);
  const errors: ValidationError[] = await validate(dto);
  if (errors.length) {
    const error = mapErrorChildren(errors);
    throw new InternalServerExceptionDale(
      ErrorCodesEnum.MON002,
      `Error validateData ${dtoData.name} ${formatError(error)}`,
    );
  }
};

export const formatDataClient = (dataClient) => {
  try {
    dataClient.PartyId = dataClient.PartyId.toString();
    dataClient.PartyType = 'N'; // el valor que llega es "PERSON", se pasa valor para que pase validate
    dataClient.PersonDEO_dl_peps_c = '00'; //el valor que llega es null, se pasa valor para que pase validate
    dataClient.SalesProfileStatus = SalesProfileStatus[
      dataClient.SalesProfileStatus
    ]
      ? SalesProfileStatus[dataClient.SalesProfileStatus]
      : '5';
    dataClient.PersonDEO_dl_genero_c =
      dataClient.PersonDEO_dl_genero_c.charAt(0);
    dataClient.PersonDEO_dl_tipo_enrrolamiento_c =
      TipoEnrrolamiento[dataClient.PersonDEO_dl_tipo_enrrolamiento_c];
    dataClient.CreationDate = transformDate(new Date(dataClient.CreationDate));
    dataClient.PersonDEO_dl_fecha_expedicion_c = transformDate(
      new Date(dataClient.PersonDEO_dl_fecha_expedicion_c),
    );
    return dataClient;
  } catch (error) {
    throw new InternalServerExceptionDale(ErrorCodesEnum.MON000, error);
  }
};

export const formatDataProduct = (product) => {
  product.creationDate = product.CreationDate
    ? transformDate(new Date(product.CreationDate))
    : 0;
  product.dl_estado_deposito_c = 
  product.dl_EstadoDeposito_c && product.dl_estado_deposito_c
    ? SalesProfileStatus[product.dl_estado_deposito_c]
    : '5';
  return product;
};

const formatError = (errors: ValidationError[]): string => {
  return errors
    .reduce(
      (errorMessages: string[], error: ValidationError) => [
        ...errorMessages,
        JSON.stringify(error),
      ],
      [],
    )
    .join('\n');
};

export const formatDataCreationDate = (eventObject) => {

  const [bodyRSresponses] = eventObject.RS.messageRS.responses;
    const confirmations = bodyRSresponses.confirmations;
    let [result] = confirmations.sort((a, b) =>
      a.data.id < b.data.id ? -1 : 0,
    );

    if( !result?.data?.creationDate || typeof result?.data === 'string' ) {
      result = {data: {}};
      const date = new Date(eventObject.RS.headerRS.timestamp);
      const hora = date.getUTCHours();
      date.setUTCHours(hora - 5);
      const formatedDate = date.toISOString().replace(".000Z", "-05:00");
      result.data.creationDate = formatedDate;
    }

    return result;
}
