import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Deposit } from './deposit.entity';

import { ErrorCodesEnum } from '../../shared/code-erros/error-codes.enum';
import { BadRequestExceptionDale } from '@dale/manage-errors-nestjs';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DepositDbService {
  constructor(
    @InjectRepository(Deposit)
    private depositRepository: Repository<Deposit>,
  ) {}

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
