import { NaturalPersonInterface, IUserBehavior } from '../interfaces';

export const CRMConnector = 'CRMConnector';

export interface CRMConnectorInterface {
  roleBehavior: IUserBehavior;
  getNaturalPerson: () => Promise<NaturalPersonInterface>;
}
