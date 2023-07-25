import { ApiProperty } from '@nestjs/swagger';
import { dateFormatter } from '../helpers/date-formater';
import { CardResponseCRM } from '../interfaces/cards-response.interface';
import { ICard } from '@dale/client/common/interfaces';

export class CardDto implements ICard {
  @ApiProperty({
    example: '300000003311318',
    description: 'Card id',
  })
  id: number;
  @ApiProperty({
    example: 'T-000032',
    description: 'Card identification',
  })
  card: string;

  @ApiProperty({
    example: 'DALE',
    description: 'Card agreement',
  })
  cardAgreement: string;
  @ApiProperty({
    example: '2023-03-14T16:35:56+00:00',
    description: 'Card cancelation date',
  })
  cardCancellationDate: string;
  @ApiProperty({
    example: '2023-03-14T16:35:56+00:00',
    description: 'Card activation date',
  })
  cardActivationDate: string;
  @ApiProperty({
    example: '2023-03-14T16:35:56+00:00',
    description: 'Card block date',
  })
  cardBlockedDate: string;
  @ApiProperty({
    example: '************1245',
    description: 'Masked card number',
  })
  cardNumber: string;
  @ApiProperty({
    example: '2023-03-10T16:35:56+00:00',
    description: 'Card creation date',
  })
  cardRequestDate: string;
  @ApiProperty({
    example: 'ACTIVO',
    description: 'Card state',
  })
  cardState: string;
  @ApiProperty({
    example: 'FISICA',
    description: 'Virtual or Physical card',
  })
  typeOfCard: string;

  constructor(cardResponseCRM: CardResponseCRM) {
    const {
      Id: id,
      RecordName: card,
      dl_ConvenioMaestro_c: cardAgreement,
      dl_NroTarjeta_c: cardNumber,
      dl_FechaActivacionDeLaTarjeta_c: cardActivationDate,
      dl_FechaCancelacion_c: cardCancellationDate = '',
      dl_FechaSolicitudTarjeta_c: cardRequestDate,
      dl_FechaCambioDeEstado_c: cardBlockedDate,
      dl_EstadoTarjeta_c: cardState,
      dl_TipoDeTarjeta_c: typeOfCard,
    } = cardResponseCRM;

    this.id = id;
    this.card = card;
    this.cardAgreement = cardAgreement;
    this.cardActivationDate = cardActivationDate
      ? dateFormatter(cardActivationDate)
      : '';
    this.cardCancellationDate = cardCancellationDate
      ? dateFormatter(cardCancellationDate)
      : '';
    this.cardBlockedDate = cardBlockedDate
      ? dateFormatter(cardBlockedDate)
      : '';
    this.cardNumber = cardNumber
      ? '*' +
        cardNumber?.slice(1, 2) +
        '*'.repeat(5) +
        cardNumber?.slice(7, 10) +
        '*'.repeat(4) +
        cardNumber?.slice(14)
      : '';
    this.cardRequestDate = cardRequestDate
      ? dateFormatter(cardRequestDate)
      : '';
    this.cardState = cardState;
    this.typeOfCard = typeOfCard;
  }
}
