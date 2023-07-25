import {
  gmfEnum,
  cardAgreementEnum,
  identificationTypeEnum,
  clientStateEnum,
  cardTypeEnum,
  pepsEnum,
} from '@dale/client/common/enums';
import { NaturalPersonInterface } from '../../../../client/common/interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { dateFormatter } from '../helpers/date-formater';
import { DepositResponseCRM } from '../interfaces';
import { CardResponseCRM } from '../interfaces/cards-response.interface';
import { NaturalPersonResponseCRM } from '../interfaces/natural-person-response.interface';
import {
  CardInfo,
  ClientStateInfo,
  DepositInfo,
  ProfileInfo,
} from '@dale/client/common/interfaces/natural-person-documentation';
import { motiveChangeEnum } from '@dale/client/common/enums/motive-change.enum';

export class NaturalPersonDto implements NaturalPersonInterface {
  @ApiProperty({
    example: '12345',
    description: 'Unique CRM id',
  })
  partyId: string;

  @ApiProperty({ type: () => ProfileInfo })
  profileInfo: {
    firstName: string;
    lastName: string;
    identificationType: identificationTypeEnum;
    identificationNumber: string;
    phoneNumber: number | string;
    linkageCity: string;
    address: string;
    email: string;
  };
  @ApiProperty({ type: () => ClientStateInfo })
  clientStateInfo: {
    clientState: clientStateEnum;
    clientStateMotiveChange: string;
    clientStateReasonChange: string;
    clientStateDateChange: string;
    clientStateComment: string;
  };

  @ApiProperty({ type: () => DepositInfo })
  depositInfo: {
    depositNumber: string;
    registrationDate: string;
    lastLogInDate: string;
    failedTriesSummary: string | number;
    monthTransactionsSummary: string | number;
    transactionsSummary: string | number;
    debitCardNoveltyDate: string;
    cardShippingAddress: string;
    peps: pepsEnum;
    GMFMarked: gmfEnum;
  };

  @ApiProperty({ type: () => CardInfo })
  cardInfo: {
    cardNumber: string;
    cardAgreement: cardAgreementEnum;
    cardDescription: string;
    typeOfCard: cardTypeEnum;
    cardState: string;
    debitCardApplicationDate: string;
    debitCardNoveltyDate: string;
    cardShippingAddress: string;
    cardStateModifiedBy: string;
  };

  constructor(
    naturalPersonResponseCRM: NaturalPersonResponseCRM,
    cardResponseCRM: CardResponseCRM,
    depositResponseCRM: DepositResponseCRM,
    transactionsSummary: string,
    monthTransactionsSummary: string,
  ) {
    const {
      CreationDate: registrationDate = '',
      PartyId: partyId = '',
      PersonDEO_dl_tipo_identificacion_c:
        identificationType = identificationTypeEnum.EMPTY,
      PersonDEO_dl_numero_identificacion_c: identificationNumber = '',
      FirstName: firstName = '',
      MiddleName: middleName = '',
      LastName: lastName = '',
      SecondLastName: secondLastName = '',
      EmailAddress: email = '',
      AddressLine1: address = '',
      City: linkageCity = '',
      RawMobileNumber: phoneNumber = '',
      LastUpdateDate: clientStateDateChange = '',
      PersonDEO_dl_peps_c: peps = pepsEnum.EMPTY,
    } = naturalPersonResponseCRM;

    const {
      dl_FechaSolicitudTarjeta_c: debitCardApplicationDate = '',
      dl_nroDeTarjeta_c: cardNumber = '',
      dl_ConvenioMaestro_c: cardAgreement = cardAgreementEnum.EMPTY,
      dl_EstadoTarjeta_c: cardState = '',
      LastUpdatedBy: cardStateModifiedBy = '',
      dl_TipoDeTarjeta_c: typeOfCard = cardTypeEnum.EMPTY,
      dl_FechaCambioDeEstado_c: debitCardNoveltyDate = '',
    } = cardResponseCRM ? cardResponseCRM : {};

    const {
      dl_NumeroDeDeposito_c: depositNumber = '',
      dl_EstadoDeposito_c: clientState = clientStateEnum.EMPTY,
      MarcadoGMF_c: GMFMarked = gmfEnum.EMPTY,
      dl_razon_c_estado_c: clientStateReasonChangeVoluntary = '',
      dl_RazonCambioDeEstado_c: clientStateReasonChangeNoVoluntary = '',
      dl_observacion_c: clientStateComment = '',
      dl_cambio_estado_c: clientStateMotiveChange = '',
    } = depositResponseCRM ? depositResponseCRM : {};

    const { failedTriesSummary = '', lastLogInDate = '' } = {};

    this.partyId = partyId.toString();

    this.profileInfo = {
      firstName: `${firstName}` + (middleName ? ` ${middleName}` : ''),
      lastName: `${lastName}` + (secondLastName ? ` ${secondLastName}` : ''),
      identificationType,
      identificationNumber,
      phoneNumber: `${phoneNumber
        .replace('-', '')
        .replace('-', '')
        .slice(-10)}`,
      email,
      address,
      linkageCity,
    };

    this.clientStateInfo = {
      clientState,
      clientStateMotiveChange: clientStateMotiveChange
        ? clientStateMotiveChange.replace('_', ' ')
        : '',
      clientStateReasonChange:
        clientStateMotiveChange === 'Voluntario'
          ? motiveChangeEnum[clientStateReasonChangeVoluntary]
          : motiveChangeEnum[clientStateReasonChangeNoVoluntary],
      clientStateDateChange: dateFormatter(clientStateDateChange),
      clientStateComment,
    };

    this.depositInfo = {
      depositNumber,
      registrationDate: dateFormatter(registrationDate),
      lastLogInDate: dateFormatter(lastLogInDate),
      failedTriesSummary,
      monthTransactionsSummary,
      transactionsSummary,
      debitCardNoveltyDate: dateFormatter(debitCardNoveltyDate),
      cardShippingAddress: address,
      peps,
      GMFMarked,
    };

    this.cardInfo = {
      cardNumber: '************' + cardNumber,
      cardAgreement,
      cardDescription: cardAgreement,
      typeOfCard,
      cardState,
      debitCardApplicationDate: dateFormatter(debitCardApplicationDate),
      debitCardNoveltyDate: dateFormatter(debitCardNoveltyDate),
      cardShippingAddress: address,
      cardStateModifiedBy,
    };
  }
}
