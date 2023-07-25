import { clientStateEnum } from '@dale/client/common/enums';
import { gmfEnum } from '@dale/client/common/enums/gmf.enum';
import { Link } from './natural-person-response.interface';

export interface DepositResponseCRM {
  Id: number;
  RecordName: string;
  CreatedBy: string;
  CreationDate: string;
  LastUpdatedBy: string;
  LastUpdateDate: string;
  RecordNumber: string;
  LastUpdateLogin?: string;
  UserLastUpdateDate: string;
  Conflictid: number;
  CurrencyCode: string;
  OraZcxOwner_Id_c: number;
  OraZcxOwner_c: string;
  SelectedRow: string;
  CurcyConvRateType: string;
  CorpcurrencyCode: string;
  MarcadoGMF_c: gmfEnum;
  dl_EstadoDeposito_c: clientStateEnum;
  dl_Contacto_Id_c: number;
  dl_Contacto_c: string;
  dl_FechaCambioEstado_c: string;
  dl_FechaMigracion_c: string;
  dl_IDUnicoClienteDALE_c: string;
  dl_Migracion_c: string;
  dl_NumeroDeDeposito_c: string;
  dl_cambio_estado_c: string;
  dl_razon_c_estado_c: string;
  dl_RazonCambioDeEstado_c: string;
  dl_convenio_del_deposito_Id_c: string;
  dl_convenio_del_deposito_c: string;
  dl_observacion_c: string;
  links: Link[];
}

export interface DepositResponseCRMByPartyNumber {
  items: DepositResponseCRM[];
  count: number;
  hasMore: boolean;
  limit: number;
  offset: number;
  links: Link[];
}
