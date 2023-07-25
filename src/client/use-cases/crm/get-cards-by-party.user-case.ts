import { Inject, Injectable, Logger, Optional } from '@nestjs/common';
import { CRMConnector } from '../../../shared/providers/crm-connector-adapter/crm-connector';
import { CardDto } from '../../../shared/providers/crm-connector-adapter/dto/cards.dto';
import { NotFoundException } from '@dale/exceptions/custom-errors/custom-exception';
import { ErrorCodesEnum } from '@dale/exceptions/code-errors/error-codes.enum';

@Injectable()
export class GetCardsByAccountPartyUseCase {
  constructor(
    @Inject(CRMConnector)
    private readonly crmConnector: CRMConnector,
    @Optional() private logger?: Logger,
  ) {}

  public async apply(partyId: string): Promise<CardDto[]> {
    try {
      const cards = await this.crmConnector.getCards(partyId);
      const mappedCards = cards.items.map((card) => new CardDto(card));
      return mappedCards;
    } catch (error) {
      this.logger.debug(error.message);
      throw new NotFoundException(
        ErrorCodesEnum.BOS019,
        'No se han encontrado tarjetas asociadas',
      );
    }
  }
}
