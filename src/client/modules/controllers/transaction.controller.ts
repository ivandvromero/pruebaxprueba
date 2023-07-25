import {
  Body,
  Controller,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TransactionService } from '../services/transaction.service';
import { TransactionQuery } from '../dto/transaction-query.dto';
import { BadRequestException } from '@dale/exceptions/custom-errors/custom-exception';
import { ErrorCodesEnum } from '@dale/exceptions/code-errors/error-codes.enum';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { Auth0Guard } from '@dale/auth/auth.guard';
import { Permissions } from '@dale/auth/permissions.decorator';
import { PermissionsGuard } from '@dale/auth/permission.guard';
import { AuditInterceptor } from '../../../shared/interceptors/audit.interceptor';
import { GetPaginationTransaction } from '../dto/get-pagination-transaction.dto';
import { PaginationNewTransactionResponse } from '@dale/client/common/interfaces/get-transactions-response';

@ApiTags('Transaction')
@ApiHeader({
  name: 'ApiVersion',
  enum: ['1'],
  description: 'Please select a version',
  required: true,
})
@Controller('api/transaction')
@UseInterceptors(AuditInterceptor)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @UseGuards(Auth0Guard, PermissionsGuard)
  @Permissions('Transaction:read')
  async getTransaction(
    @Body() transactionQuery: TransactionQuery,
    @Query() query: GetPaginationTransaction,
  ): Promise<PaginationNewTransactionResponse> {
    const body = { ...transactionQuery };
    const { initialDate, endDate } = transactionQuery;
    const areAllFieldsEmpty = Object.values(body).every(
      (value) => value === '',
    );
    if (areAllFieldsEmpty) {
      throw new BadRequestException(
        ErrorCodesEnum.BOS017,
        'Se debe ingresar al menos un parametro de busqueda',
      );
    }

    if ((initialDate && !endDate) || (!initialDate && endDate)) {
      throw new BadRequestException(
        ErrorCodesEnum.BOS017,
        'Se debe ingresar el rango de fechas completo',
      );
    }

    return await this.transactionService.getTransactionsHandler(
      {
        ...transactionQuery,
        initialDate: new Date(transactionQuery.initialDate),
        endDate: new Date(transactionQuery.endDate),
      },
      { ...query },
    );
  }
}
