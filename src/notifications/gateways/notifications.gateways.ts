import { Logger } from '@dale/logger-nestjs';
import { Optional } from '@nestjs/common';
import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GetNotificationsService } from '../services/get-notifications.service';
import { ClientManagerGateway } from '../services/client-manager-gateway.service';
import { AuthService } from '@dale/auth/auth.service';
import { TokenDecodedInterface } from '../shared/interfaces/decoded-token.interface';
import { MonetaryAdjustmentPermissions } from '@dale/permissions/monetary-adjustments.enum';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/api/notifications/ws',
  path: '/api/notifications/ws/socket.io',
})
export class NotificationsGateway implements OnGatewayConnection {
  @WebSocketServer() public server: Server;

  constructor(
    private readonly getNotificationsService: GetNotificationsService,
    private readonly clientManagerGateway: ClientManagerGateway,
    private readonly authService: AuthService,
    @Optional() private logger: Logger,
  ) {}

  afterInit() {
    this.logger.debug('Web socket initialized');
  }

  async handleConnection(client: Socket) {
    const tokenDecoded = await this.validateConnection(client);
    if (!tokenDecoded) return;
    const { email } = tokenDecoded;
    await this.clientManagerGateway.registerClient(email, client.id);
  }

  async handleDisconnect(client: Socket) {
    await this.clientManagerGateway.removeCLient(client.id);
  }

  @SubscribeMessage('notifications')
  async handleSendMessage(client: Socket): Promise<void> {
    const tokenDecoded = await this.validateConnection(client);
    if (!tokenDecoded) return;
    const { email } = tokenDecoded;
    const notifications = await this.getNotificationsService.run(email);
    this.server.to(client.id).emit('notifications', notifications);
  }

  private async validateConnection(
    client: Socket,
  ): Promise<TokenDecodedInterface | undefined> {
    const authHeader = client.handshake.headers.authorization;
    if (!authHeader) {
      client.disconnect();
      return;
    }
    const token = authHeader.replace('Bearer ', '');
    const resp = await this.authService.valiDateToken(token);
    const { authorized, tokenDecoded } = resp;
    if (!authorized) {
      client.disconnect();
      return;
    }
    if (
      !tokenDecoded.permissions.includes(
        MonetaryAdjustmentPermissions.NOTIFICATIONS_READ,
      )
    ) {
      client.disconnect();
      return;
    }
    return tokenDecoded;
  }
}
