import {
  cardAgreementEnum,
  cardTypeEnum,
  cardStateEnum,
} from '@dale/client/common/enums';
import { Link, Links } from './natural-person-response.interface';

export interface CardResponseCRM {
  Id: number;
  RecordName: string;
  CreatedBy: string;
  CreationDate: string;
  LastUpdatedBy: string;
  LastUpdateDate: string;
  RecordNumber: string;
  PersonProfile_Id_c: number;
  LastUpdateLogin: string;
  UserLastUpdateDate?: string;
  ConflictId: number;
  CurrencyCode: string;
  CurcyConvRateType: string;
  CorpCurrencyCode: string;
  OraZcxOwner_Id_c: string;
  OraZcxOwner_c: string;
  SelectedRow: string;
  dl_Contacto_Id_c: number;
  dl_Contacto_c: string;
  dl_ConvenioDeLaTarjeta_Id_c: string;
  dl_ConvenioDeLaTarjeta_c: string;
  dl_EstadoTarjeta_c: cardStateEnum;
  dl_FechaActivacionDeLaTarjeta_c: string;
  dl_FechaCambioDeEstado_c: string;
  dl_FechaCancelacion_c: string;
  dl_FechaMigracion_c: string;
  dl_FechaDeRegistro_c: string;
  dl_FechaSolicitudTarjeta_c: string;
  dl_IDUnicoClienteDALE_c: string;
  dl_IldentificadorEnCMS_c: string;
  dl_Migracion_c: string;
  dl_MotivoCambioFisica_c: string;
  dl_MotivoCambioDeEstadoTarjetaVirtual_c: string;
  dl_NoDeTarjeta_c: string;
  dl_TipoDeTarjeta_c: cardTypeEnum;
  dl_nroDeTarjeta_c: string;
  dl_ConvenioMaestro_Id_c: string;
  dl_ConvenioMaestro_c: cardAgreementEnum;
  dl_conveniodeposito_Id_c: string;
  dl_conveniodeposito_c: string;
  dl_NroTarjeta_c: string;
  links: Link[];
}

export interface CardResponseCRMByContactRelated {
  items: CardResponseCRM[];
  count: number;
  hasMore: boolean;
  limit: number;
  offset: number;
  links: Links[];
}
