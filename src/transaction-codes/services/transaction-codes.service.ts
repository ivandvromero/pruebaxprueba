import { Logger } from '@dale/logger-nestjs';
import { Injectable, Optional } from '@nestjs/common';
import { TransactionCodeDto } from '../dto/transaction-code.dto';
import { TransactionCodesRepository } from '../repositories';

@Injectable()
export class TransactionCodeService {
  constructor(
    @Optional() private logger: Logger,
    private readonly transactionCodeRepository: TransactionCodesRepository,
  ) {}

  async createTransactionCode(transactionCode: TransactionCodeDto) {
    this.logger.debug('createTransactionCode.service started!');
    return this.transactionCodeRepository.createTransactionCode(
      transactionCode,
    );
  }

  async insertManyTransactionCodes(
    transactionCodes: InsertManyTransactionCodes[],
  ) {
    this.logger.debug('insertManyTransactionCodes.service started!');

    return this.transactionCodeRepository.insertManyTransactionCodes(
      transactionCodes,
    );
  }

  async getDescriptionCode(code: string): Promise<string> {
    return await this.transactionCodeRepository.getDescriptionCode(code);
  }

  async getRolesByCode(code: string): Promise<string[]> {
    return await this.transactionCodeRepository.getRolesByCode(code);
  }

  async deleteTransactionCodes(): Promise<boolean> {
    return await this.transactionCodeRepository.deleteManyTransactionCodes();
  }
}

interface InsertManyTransactionCodes {
  code: string;
  description: string;
  roles: any[];
}
