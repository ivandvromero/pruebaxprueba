import { clientStateEnum, gmfEnum } from '../../../../shared/enums/crm-enum';

export class DepositResponseCRM {
  items?: Items[];
  count?: number;
  hasMore?: boolean;
  limit?: number;
  offset?: number;
  links?: Link[];
  cambioEstado?: any;
}
export class Items {
  Id?: number;
  RecordName?: string;
  CreatedBy?: string;
  CreationDate?: string;
  LastUpdatedBy?: string;
  LastUpdateDate?: string;
  RecordNumber?: string;
  LastUpdateLogin?: string;
  UserLastUpdateDate?: Date;
  ConflictId?: number;
  CurrencyCode?: string;
  CurcyConvRateType?: string;
  CorpCurrencyCode?: string;
  OraZcxOwner_Id_c?: number;
  OraZcxOwner_c?: string;
  SelectedRow?: any;
  dl_Contacto_Id_c?: number;
  dl_Contacto_c?: string;
  dl_EstadoDeposito_c?: string;
  dl_FechaCambioEstado_c?: any;
  dl_FechaMigracion_c?: any;
  dl_IDUnicoClienteDALE_c?: any;
  MarcadoGMF_c?: gmfEnum;
  dl_Migracion_c?: any;
  dl_NumeroDeDeposito_c?: string;
  dl_cambio_estado_c?: string;
  dl_razon_c_estado_c?: string;
  dl_RazonCambioDeEstado_c?: any;
  dl_convenio_del_deposito_Id_c?: any;
  dl_convenio_del_deposito_c?: any;
  dl_observacion_c?: any;
  dl_Fecha_De_Creacion_c?: Date;
  dl_EstadoDepositoLR_c?: any;
  dl_EstadoDepositoAR_c?: any;
  dl_EstadoDepositoCallC_c?: any;
  dl_EstadoDepositoLO_c?: any;
  dl_estado_deposito2_c?: clientStateEnum;
  dl_convenio_maestro_deposito_Id_c?: any;
  dl_convenio_maestro_deposito_c?: any;
  dl_responsable_deposito_c?: any;
  Organization_Id_PersonTodl_DepositosFordl_Cuenta?: any;
  dl_cuenta_Id_c?: any;
  dl_cuenta_c?: any;
  links?: Link[];
}

export class Link {
  rel?: string;
  href?: string;
  name?: string;
  kind?: string;
  properties?: Property;
}

export class Property {
  changeIndicator?: string;
}
