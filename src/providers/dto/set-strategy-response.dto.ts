import { ProviderStrategy } from '../../providers/context/provider-strategy.interface';
import { BP } from '../../dto/message-event-CFO.dto';

export class SetStrategyResponse {
  strategy: ProviderStrategy;
  ordererBP: BP;
  beneficiaryBP: BP;
}
