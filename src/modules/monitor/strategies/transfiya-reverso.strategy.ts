import { BaseTransform } from '../../../providers/context/provider-context';
import { ProviderStrategy } from '../../../providers/context/provider-strategy.interface';
import { TypeTransactionPts } from '../../../config/env/env.config';
import { MessageEvent } from '../../../dto/content.dto';
import { BP, OrdererBP } from '../../../dto/message-event-CFO.dto';
import { CrmService } from '../../../providers/crm/crm.service';

export class TransfiyaReversoStrategy implements ProviderStrategy {
  constructor(private crmService: CrmService) {}

  public async doAlgorithm(
    data: BaseTransform,
    eventObject: MessageEvent,
  ): Promise<BaseTransform> {
    data.transactionTransform.Field_K7_0091 = 'TransfiReverso';
    data.transactionTransform.Field_K7_0092 = TypeTransactionPts.RecibirDale2;
    data.transactionTransform.Field_K7_0102 = 'S';
    data.transactionTransform.Field_K7_0104 = 'observacion reverso';
    return data;
  }
  public async getProductDestination(
    eventObject: MessageEvent,
    clientDestination,
  ) {
    return { productDestination: {} };
  }

  async getClientDestination(externalId: string, eventObject: MessageEvent) {
    return { clientDestination: {} };
  }

  public getOrderer(eventObject: MessageEvent): OrdererBP {
    const [beneficiaries] = eventObject.CFO.beneficiaries;
    return beneficiaries.additionals.beneficiary.BP;
  }

  public getBeneficiary(eventObject: MessageEvent): BP {
    return { externalId: '' };
  }
}
