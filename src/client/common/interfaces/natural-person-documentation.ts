import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import {
  cardAgreementEnum,
  cardTypeEnum,
  clientStateEnum,
  gmfEnum,
  identificationTypeEnum,
  pepsEnum,
} from '../enums';
import {
  CardInfoNaturalPerson,
  ClientStateInfoNaturalPerson,
  DepositInfoNaturalPerson,
  ProfileInfoNaturalPerson,
} from './natural-person.interface';

@ApiExtraModels()
export class ProfileInfo implements ProfileInfoNaturalPerson {
  @ApiProperty({
    example: 'Carl',
    description: 'Client first name',
  })
  firstName: string;
  @ApiProperty({
    example: 'Johnson',
    description: 'Client last names ',
  })
  lastName: string;
  @ApiProperty({
    example: 'CC',
    description: 'Client identification type',
  })
  identificationType: identificationTypeEnum;
  @ApiProperty({
    example: '1020304050',
    description: 'Client identification number',
  })
  identificationNumber: string;
  @ApiProperty({
    example: '3003334444',
    description: 'Client phone number',
  })
  phoneNumber: number | string;
  @ApiProperty({
    example: 'Cali',
    description: 'City of residence of the client',
  })
  linkageCity: string;
  @ApiProperty({
    example: 'Cra 20 # 30 - 50',
    description: 'Client address',
  })
  address: string;
  @ApiProperty({
    example: 'clientEmail@mail.com',
    description: 'Client email',
  })
  email: string;
}

@ApiExtraModels()
export class ClientStateInfo implements ClientStateInfoNaturalPerson {
  @ApiProperty({
    example: 'ACTIVO',
    description: 'Deposit status',
  })
  clientState: clientStateEnum;
  @ApiProperty({
    description: 'Client state motive change',
  })
  clientStateMotiveChange: string;
  @ApiProperty({
    description: 'Client state reasons change',
  })
  clientStateReasonChange: string;
  @ApiProperty({
    example: '2023-03-01',
    description: 'Deposit status date change',
  })
  clientStateDateChange: string;
  @ApiProperty({
    description: 'Client state comment change',
  })
  clientStateComment: string;
}

@ApiExtraModels()
export class DepositInfo implements DepositInfoNaturalPerson {
  @ApiProperty({
    example: '39847902386589',
    description: 'Deposit number',
  })
  depositNumber: string;
  @ApiProperty({
    example: '2023-03-01',
    description: 'Client registration date',
  })
  registrationDate: string;
  @ApiProperty({
    example: '2023-03-01',
    description: 'Last login date at Dale app',
  })
  lastLogInDate: string;
  @ApiProperty({
    example: '23',
    description: 'Summary of failed transactions',
  })
  failedTriesSummary: number | string;
  @ApiProperty({
    example: '10',
    description: 'Summary of transactions last month',
  })
  monthTransactionsSummary: number | string;
  @ApiProperty({
    example: '100',
    description: 'Summary of transactions last month',
  })
  transactionsSummary: number | string;
  @ApiProperty({
    example: '2023-03-01',
    description: 'Card novelty date',
  })
  debitCardNoveltyDate: string;
  @ApiProperty({
    example: 'Cra 20 # 30 - 50',
    description: 'Card shipping address',
  })
  cardShippingAddress: string;
  @ApiProperty({
    example: 'SI',
    description: 'Politically Exposed Persons',
  })
  peps: pepsEnum;
  @ApiProperty({
    example: 'SI',
    description: 'GMF marked values: "SI" or "NO"',
  })
  GMFMarked: gmfEnum;
}

@ApiExtraModels()
export class CardInfo implements CardInfoNaturalPerson {
  @ApiProperty({
    example: '************1245',
    description: 'Masked card number',
  })
  cardNumber: string;
  @ApiProperty({
    example: 'DALE',
    description: 'Card agreement',
  })
  cardAgreement: cardAgreementEnum;
  @ApiProperty({
    example: 'DALE',
    description: 'Card',
  })
  cardDescription: string;
  @ApiProperty({
    example: 'FISICA',
    description: 'Virtual or Physical card',
  })
  typeOfCard: cardTypeEnum;
  @ApiProperty({
    example: 'ACTIVO',
    description: 'Card state',
  })
  cardState: string;
  @ApiProperty({
    example: '2023-03-01',
    description: 'Card creation date',
  })
  debitCardApplicationDate: string;
  @ApiProperty({
    example: '2023-03-01',
    description: 'Card novelty date',
  })
  debitCardNoveltyDate: string;
  @ApiProperty({
    example: 'Cra 20 # 30 - 50',
    description: 'Card shipping address',
  })
  cardShippingAddress: string;
  @ApiProperty({
    example: 'userWhoModified@mail.com',
    description: 'Email of the user who changed the card state',
  })
  cardStateModifiedBy: string;
}
