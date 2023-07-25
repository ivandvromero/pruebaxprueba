import { IClient } from './client.interface';

export interface IUserBehavior {
  mapClient(client: IClient): IClient;
}
