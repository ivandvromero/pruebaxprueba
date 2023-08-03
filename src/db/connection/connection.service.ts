import { Logger } from '@dale/logger-nestjs';
import {
  Injectable,
  OnApplicationShutdown,
  OnModuleDestroy,
  Optional,
} from '@nestjs/common';
import { getDbConfig } from '../../utils/db-config';
import {
  Connection,
  EntitySchema,
  getConnectionManager,
  ObjectType,
} from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { inspect } from 'util';
import { v4 as uuid } from 'uuid';

const meta = { context: 'DatabaseService' };

@Injectable()
export class DatabaseService implements OnModuleDestroy, OnApplicationShutdown {
  constructor(@Optional() private logger?: Logger) {}

  get connection(): any {
    const manager = getConnectionManager();
    return manager.connections[manager.connections.length - 1];
  }

  get manager() {
    return getConnectionManager();
  }

  public static removeOrphanConnections = true;

  private static async closeConnections(connections: Connection[]) {
    await Promise.all(
      connections.map(async (connection) => {
        if (connection.isConnected) {
          await connection.close();
        }
      }),
    );
    return connections;
  }

  async removeOldConnections(newConnection: Connection) {
    const removedConnections = this.manager.connections.filter(
      (conn) => conn.name != newConnection.name,
    );

    if (removedConnections.length) {
      try {
        await DatabaseService.closeConnections(removedConnections);
      } catch (err) {
        return this.logger?.error(
          `${err.message || err}, ${err.stack}, ${inspect({ meta })}`,
        );
      }
    }
  }

  getRepository<Entity>(
    target: ObjectType<Entity> | EntitySchema<Entity> | string,
  ) {
    return this.connection.getRepository(target);
  }

  async createConnection(options: PostgresConnectionOptions) {
    const name = uuid();
    this.logger?.log(
      `creating new database connection '${name}', ${inspect({ meta })}`,
    );
    return this.manager.create({
      ...options,
      name,
    });
  }

  async init(config, username) {
    const dbConfig = await getDbConfig(username);
    const manager = this.manager;
    const newConnection = await this.createConnection({
      ...config,
      ...dbConfig,
    });
    const newConnectionIndex = this.getConnectionIndex(newConnection);
    try {
      if (DatabaseService.removeOrphanConnections) {
        await this.removeOldConnections(newConnection);
      }
      await newConnection.connect();
    } catch (error) {
      manager.connections.splice(newConnectionIndex, 1);
    }
  }

  async onModuleDestroy() {
    await this.cleanup();
  }

  async onApplicationShutdown() {
    await this.cleanup();
  }

  getConnectionIndex(connection: Connection) {
    return this.manager.connections.indexOf(connection);
  }

  private async cleanup() {
    const { connections } = getConnectionManager();
    await DatabaseService.closeConnections(
      connections.splice(0, connections.length),
    );
  }

  async isDbConnectionAlive(): Promise<boolean | string> {
    try {
      const query =
        'SELECT COLUMN_NAME  FROM information_schema.COLUMNS LIMIT 1';
      await this.connection.query(query);
      return true;
    } catch (error) {
      this.logger?.error(`Error - ${error}`);
      return error.message;
    }
  }
}
