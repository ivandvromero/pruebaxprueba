import { CACHE_MANAGER, Inject, Injectable, Optional } from '@nestjs/common';
import { Logger } from '@dale/logger-nestjs';
import { Cache } from 'cache-manager';
import { TTL_REDIS_CONFIG } from '../../shared/config/redis-config';

@Injectable()
export class ClientManagerGateway {
  constructor(
    @Optional() private logger: Logger,
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
  ) {}

  keyConnectedClients = 'NotificationsClients';

  async registerClient(email: string, socketId: string) {
    const clients: ConnectedClients =
      (await this.cache.get<ConnectedClients>(this.keyConnectedClients)) || {};

    const ids = Object.keys(clients);
    const filtered = ids.filter((id) => clients[id].email === email);

    if (filtered[0]) {
      filtered.forEach((id) => {
        delete clients[id];
      });
    }
    clients[socketId] = { email: email };
    await this.cache.set<string>(this.keyConnectedClients, clients, {
      ttl: TTL_REDIS_CONFIG.NOTIFICATIONS_TIME,
    });
  }

  async removeCLient(socketId: string) {
    try {
      const clients: ConnectedClients = await this.cache.get<ConnectedClients>(
        this.keyConnectedClients,
      );
      delete clients[socketId];
      await this.cache.set<string>(this.keyConnectedClients, clients, {
        ttl: TTL_REDIS_CONFIG.NOTIFICATIONS_TIME,
      });
    } catch (err) {
      this.logger.error(err);
    }
  }

  async findClient(email: string): Promise<string | undefined> {
    const clients: ConnectedClients = await this.cache.get<ConnectedClients>(
      this.keyConnectedClients,
    );
    if (!clients) {
      return undefined;
    }
    const ids = Object.keys(clients);
    const filtered = ids.filter((id) => clients[id].email === email);
    return filtered[0];
  }
}

interface ConnectedClients {
  [id: string]: {
    email: string;
  };
}
