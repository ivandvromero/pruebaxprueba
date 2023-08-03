import { InternalServerExceptionDale } from '@dale/manage-errors-nestjs';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { config } from '../../config/account.orm.config';
import serviceConfiguration from '../../config/service-configuration';
import { ErrorCodesEnum } from '../../shared/code-errors/error-codes.enum';
import { Repository } from 'typeorm';
import { DatabaseService } from '../connection/connection.service';
import { Account } from './account.entity';
import { Logger } from '@dale/logger-nestjs';
import { HeaderDTO } from 'src/shared/models/common-header.dto';
import { HeadersEvent } from 'src/shared/dtos/events.dto';

@Injectable()
export class AccountDbService implements OnModuleInit {
  private accountRepository: Repository<Account>;
  constructor(private dbService: DatabaseService, private logger: Logger) {}

  async onModuleInit() {
    await this.dbService.init(config, process.env.TYPEORM_ACCOUNT_USERNAME);
    this.accountRepository = this.dbService.getRepository(Account);
    if (serviceConfiguration().database.db_rotating_key === 'true') {
      setInterval(async () => {
        await this.dbService.init(
          config,
          serviceConfiguration().database.typeorm_account_database,
        );
        this.accountRepository = this.dbService.getRepository(Account);
      }, Number(serviceConfiguration().database.db_connection_refresh_minutes) * 60 * 1000);
    }
  }

  async createAccount(account: Account): Promise<Account> {
    try {
      return await this.accountRepository.save(account);
    } catch (error) {
      this.logger.log(`Print exception database layer`, JSON.stringify(error));
      throw new InternalServerExceptionDale(ErrorCodesEnum.ACN004, error);
    }
  }

  async getAccountsByUserId(
    userId: string,
    headers: HeaderDTO,
  ): Promise<Account[]> {
    try {
      return await this.accountRepository.findBy({ userId });
    } catch (error) {
      this.logger.error('Error db', error, headers.TransactionId);
      throw new InternalServerExceptionDale(ErrorCodesEnum.ACN010, error);
    }
  }

  async getOneAccountByUserIdAndAccountNumber(
    userId: string,
    accountNumber: string,
    headers: HeadersEvent,
  ): Promise<Account> {
    try {
      return await this.accountRepository.findOneBy({ userId, accountNumber });
    } catch (error) {
      this.logger.error('Error db', error, headers.transactionId);
      throw new InternalServerExceptionDale(ErrorCodesEnum.ACN011, error);
    }
  }

  async updateAccount(
    id: string,
    account: Partial<Account>,
    headers: HeadersEvent,
  ) {
    try {
      const result = await this.accountRepository.update({ id }, account);
      return result;
    } catch (error) {
      this.logger.error(
        `Error updateAccountDataCrm data: ${JSON.stringify(account)}`,
        error,
        headers.transactionId,
      );
      throw new InternalServerExceptionDale(ErrorCodesEnum.ACN012, error);
    }
  }

  async isDbConnectionAlive(): Promise<boolean | string> {
    return this.dbService.isDbConnectionAlive();
  }
}
