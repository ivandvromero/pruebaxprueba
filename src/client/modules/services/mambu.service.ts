import { IFilterCriteria } from '@dale/client/common/interfaces';
import { DateFormatHelper } from '../../../shared/providers/mambu-connector-adapter/helpers';
import { GetTransactionsWithHeadersUseCase } from '@dale/client/use-cases';
import { Injectable } from '@nestjs/common';
import { TransactionQueryQuantity } from '../dto/transaction-query-quantity.dto';
import { GetClientByIdentificationNumberUseCase } from '@dale/client/use-cases/get-client-by-identification-number-use-case';

@Injectable()
export class MambuService {
  constructor(
    private readonly getTransactionWithHeadersUseCase: GetTransactionsWithHeadersUseCase,
    private readonly getClientByIdentificationNumberUseCase: GetClientByIdentificationNumberUseCase,
  ) {}
  async getTransactionsCount(
    transactionQuery: TransactionQueryQuantity,
  ): Promise<string> {
    const { initialDate, endDate, identification } = transactionQuery;
    const filtersCriteria: IFilterCriteria[] = [];
    const formatter = new DateFormatHelper();
    try {
      const client = await this.getClientByIdentificationNumberUseCase.apply(
        identification,
      );
      const { encodeKey } = client;

      if (initialDate && endDate) {
        filtersCriteria.push({
          field: 'valueDate',
          value: formatter.format(endDate),
          secondValue: formatter.format(initialDate),
        });
      }
      filtersCriteria.push({
        field: 'parentAccountKey',
        value: encodeKey,
      });

      const rawData = await this.getTransactionWithHeadersUseCase.apply(
        filtersCriteria,
      );
      return rawData.headers['items-total'];
    } catch (err) {
      return '0';
    }
  }
}
