import { Injectable, OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { config } from '../../../src/config/user.orm.config';
import { DatabaseService } from '../connection/connection.service';
import { Deposit } from './deposit.entity';

import { ErrorCodesEnum } from '../../shared/code-erros/error-codes.enum';
import serviceConfiguration from '../../config/service-configuration';
import { BadRequestExceptionDale } from '@dale/manage-errors-nestjs';

@Injectable()
export class DepositDbService implements OnModuleInit {
  private depositRepository: Repository<Deposit>;
  constructor(private dbService: DatabaseService) {}

  async onModuleInit() {
    this.depositRepository = this.dbService.getRepository(Deposit);
    if (serviceConfiguration().database.db_rotating_key === 'true') {
      setInterval(async () => {
        await this.dbService.init(
          config,
          serviceConfiguration().database.typeorm_user_database,
        );
        this.depositRepository = this.dbService.getRepository(Deposit);
      }, Number(serviceConfiguration().database.db_connection_refresh_minutes) * 60 * 1000);
    }
  }

  async findDepositByAccountNumber(accountNumber: string) {
    let result;
    try {
      result = await this.depositRepository.findOne({
        relations: ['user'],
        where: { accountNumber: accountNumber },
      });
    } catch (error) {
      throw new BadRequestExceptionDale(ErrorCodesEnum.MUS000, error);
    }
    return result;
  }

  async findDepositByUserId(userId: string) {
    try {
      const userList: Deposit[] = await this.depositRepository.find({
        relations: ['user'],
        loadRelationIds: true,
        where: {
          user: {
            id: userId,
          },
        },
      });
      const result = userList.map((x) => x.accountNumber);
      return result;
    } catch (error) {
      throw new BadRequestExceptionDale(ErrorCodesEnum.MUS000, error);
    }
  }

  async AddUserDeposit(deposit: {
    user;
    accountNumber: string;
  }): Promise<Deposit> {
    try {
      return await this.depositRepository.save(deposit);
    } catch (error) {
      throw new BadRequestExceptionDale(ErrorCodesEnum.MUS000, error);
    }
  }
}
