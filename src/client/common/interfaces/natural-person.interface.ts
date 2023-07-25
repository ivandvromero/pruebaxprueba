import {
  gmfEnum,
  clientStateEnum,
  identificationTypeEnum,
  pepsEnum,
  cardTypeEnum,
  cardAgreementEnum,
} from '../../common/enums';

export interface NaturalPersonInterface {
  profileInfo: ProfileInfoNaturalPerson;
  clientStateInfo: ClientStateInfoNaturalPerson;
  depositInfo: DepositInfoNaturalPerson;
  cardInfo: CardInfoNaturalPerson;
  partyId: string;
}

export interface ProfileInfoNaturalPerson {
  firstName: string;
  lastName: string;
  identificationType: identificationTypeEnum;
  identificationNumber: string;
  phoneNumber: number | string;
  linkageCity: string;
  address: string;
  email: string;
}
export interface ClientStateInfoNaturalPerson {
  clientState: clientStateEnum;
  clientStateMotiveChange: string;
  clientStateReasonChange: string;
  clientStateDateChange: string;
  clientStateComment: string;
}
export interface DepositInfoNaturalPerson {
  depositNumber: string;
  registrationDate: string;
  lastLogInDate: string;
  failedTriesSummary: number | string;
  monthTransactionsSummary: number | string;
  transactionsSummary: number | string;
  debitCardNoveltyDate: string;
  cardShippingAddress: string;
  peps: pepsEnum;
  GMFMarked: gmfEnum;
}
export interface CardInfoNaturalPerson {
  cardNumber: string;
  cardAgreement: cardAgreementEnum;
  cardDescription: string;
  typeOfCard: cardTypeEnum;
  cardState: string;
  debitCardApplicationDate: string;
  debitCardNoveltyDate: string;
  cardShippingAddress: string;
  cardStateModifiedBy: string;
}
