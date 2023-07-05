import { getConnectionManager } from 'typeorm';
import { Injectable, Optional } from '@nestjs/common';
import { Logger } from '@dale/logger-nestjs';
@Injectable()
export class DatabaseService {
  constructor(@Optional() private logger?: Logger) {}

  get connection(): any {
    const manager = getConnectionManager();
    return manager.connections[manager.connections.length - 1];
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
