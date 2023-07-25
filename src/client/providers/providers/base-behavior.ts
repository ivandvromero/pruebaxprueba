import { IClient, IUserBehavior } from '../../common/interfaces';
export class BaseBehavior implements IUserBehavior {
  mapClient(client: IClient): IClient {
    return client;
  }
}
