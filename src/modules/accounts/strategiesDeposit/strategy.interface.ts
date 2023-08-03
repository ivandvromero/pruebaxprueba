import { DepositResponseCRM } from '../../../providers/crm/dto/actualizar/crmActualResponse.dto';

export interface StrategyInterface {
  changeOfDepositStatus(params: DepositResponseCRM): Promise<any>;
}
