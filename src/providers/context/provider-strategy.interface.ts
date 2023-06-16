import { BaseTransform } from '../../providers/context/provider-context';
import { BP, OrdererBP } from '../../dto/message-event-CFO.dto';
import { MessageEvent } from '../../dto/content.dto';
export interface ProviderStrategy {
  doAlgorithm(
    data: BaseTransform,
    eventObject?: MessageEvent,
  ): Promise<BaseTransform>;

  getProductDestination(
    eventObject?: MessageEvent,
    clientDestination?,
  ): Promise<any>;

  getClientDestination(
    externalId: string,
    eventObject?: MessageEvent,
  ): Promise<any>;

  getOrderer(eventObject?: MessageEvent): OrdererBP;

  getBeneficiary(eventObject?: MessageEvent): BP;
}
