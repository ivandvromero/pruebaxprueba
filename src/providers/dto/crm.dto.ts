import { IsDefined, IsNotEmpty, IsOptional } from 'class-validator';
export class CrmDataClient {
  @IsDefined()
  @IsNotEmpty()
  PartyId: string;
  @IsDefined()
  @IsNotEmpty()
  PartyType: string;
  @IsDefined()
  @IsNotEmpty()
  PersonDEO_dl_tipo_identificacion_c: string;
  @IsDefined()
  @IsNotEmpty()
  PersonDEO_dl_numero_identificacion_c: string;
  @IsDefined()
  @IsNotEmpty()
  ContactName: string;
  @IsOptional()
  EmailAddress: string;
  @IsOptional()
  WorkPhoneNumber: string;
  @IsDefined()
  @IsNotEmpty()
  CreationDate: number;
  @IsDefined()
  @IsNotEmpty()
  PersonDEO_dl_fecha_expedicion_c: number;
  @IsDefined()
  @IsNotEmpty()
  PersonDEO_dl_peps_c: string;
  @IsDefined()
  @IsNotEmpty()
  Country: string;
  @IsDefined()
  @IsNotEmpty()
  SalesProfileStatus: string;
  @IsDefined()
  @IsNotEmpty()
  PersonDEO_dl_genero_c: string;
  // Value of product
  @IsDefined()
  @IsNotEmpty()
  PersonDEO_dl_tipo_enrrolamiento_c: string;
  //TODO validar links
}
export class CrmDataProductOrigin {
  @IsDefined()
  @IsNotEmpty()
  CreationDate: string;
  @IsDefined()
  @IsNotEmpty()
  dl_estado_deposito_c: string;}

export class CrmDataProductDestination {
  @IsDefined()
  @IsNotEmpty()
  CreationDate: string;
  @IsDefined()
  @IsNotEmpty()
  dl_estado_deposito_c: string;
}
