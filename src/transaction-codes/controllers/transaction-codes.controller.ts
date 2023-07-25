import {
  Body,
  Controller,
  Delete,
  Optional,
  Post,
  UseGuards,
  UseInterceptors,
  Version,
} from '@nestjs/common';
import { Logger } from '@dale/logger-nestjs';
import { TransactionCodeService } from '../services/transaction-codes.service';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { TransactionCodeDto } from '../dto/transaction-code.dto';
import { transactionCodes } from '../shared/common/transactionCodes';
import { Permissions } from '@dale/auth/permissions.decorator';
import { Auth0Guard } from '@dale/auth/auth.guard';
import { PermissionsGuard } from '@dale/auth/permission.guard';
import { AuditInterceptor } from '@dale/interceptors/audit.interceptor';

@ApiHeader({
  name: 'ApiVersion',
  enum: ['1'],
  description: 'Please select a version',
  required: true,
})
@Controller('api/transactionCode')
@UseInterceptors(AuditInterceptor)
@ApiBearerAuth()
export class TransactionCodeController {
  transactionCodes = transactionCodes;

  constructor(
    @Optional() private logger: Logger,
    private readonly transactionCodeService: TransactionCodeService,
  ) {}

  @Version('1')
  @Post()
  @ApiTags('Transaction Codes')
  @ApiOperation({
    summary: 'Create a transaction code',
    description: 'This endpoints allows you to create a new transaction code.',
  })
  @UseGuards(Auth0Guard, PermissionsGuard)
  @Permissions('SuperAdmin:write')
  createTransactionCode(@Body() dto: TransactionCodeDto) {
    this.logger.debug('createTransactionCode.controller started!');
    return this.transactionCodeService.createTransactionCode(dto);
  }

  @Version('1')
  @Post('many')
  @ApiTags('Transaction Codes')
  @ApiOperation({
    summary: 'Create a transaction code',
    description: 'This endpoints allows you to create a new transaction code.',
  })
  @UseGuards(Auth0Guard, PermissionsGuard)
  @Permissions('SuperAdmin:write')
  insertManyTransactionCodes() {
    this.logger.debug('insertManyTransactionCodes.controller started!');

    return this.transactionCodeService.insertManyTransactionCodes(
      this.transactionCodes,
    );
  }

  @Version('1')
  @Delete('delete')
  @ApiTags('Transaction Codes')
  @ApiOperation({
    summary: 'Create a transaction code',
    description: 'This endpoints allows you to create a new transaction code.',
  })
  @UseGuards(Auth0Guard, PermissionsGuard)
  @Permissions('SuperAdmin:write')
  async deleteTransactionCodes() {
    return await this.transactionCodeService.deleteTransactionCodes();
  }
}
