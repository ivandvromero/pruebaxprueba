import {
  Controller,
  Get,
  Query,
  Param,
  Version,
  Inject,
  Body,
  Post,
} from '@nestjs/common';
import {
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
  ApiHeader,
} from '@nestjs/swagger';
import { ConditionalAuditCreator } from '@dale/shared-nestjs/utils/audit/audit-creator';
import {
  ActorType,
  OperationType,
} from '@dale/shared-nestjs/utils/audit/types';
import { Logger } from '@dale/logger-nestjs';

import configuration from '../../config/service-configuration';
import { AccountsService } from './accounts.service';
import {
  AccountDetailsByClientIdDto,
  AccountDetailsByClientIdResponse,
  AccountNumbersByClientIdDto,
  AccountNumbersByClientIdResponse,
  AccountDetailsByAccountIdDto,
  AccountDetailsByAccountIdQueryDto,
  AccountDetailsByAccountIdResponse,
  GetAccountsByUserIdDataResponseDto,
  GetAccountsByUserIdRequestDto,
  ModifyLimitsInputDto,
  GetCertificateStrategyDataInputDto,
  GetCertificateResponseDto,
} from './dto/accounts.dto';
import { ErrorCustomizer } from '../../utils/customize-error';
import { functionalities } from './constants/audit';
import { HeaderDTO } from '../../shared/models/common-header.dto';
import { RequestHeader } from '../../shared/decorators/headers.decorator';
import { PtsResponse } from './dto/pts.dto';
import { ProviderException } from '../../shared/custom-errors/provider-exception';
import {
  CustomException,
  InternalServerExceptionDale,
} from '@dale/manage-errors-nestjs';
import { ErrorCodesEnum } from '../../shared/code-errors/error-codes.enum';
import {
  ClientKafka,
  KafkaContext,
  EventPattern,
  Ctx,
  Payload,
} from '@nestjs/microservices';
import { AccountModifyLimitsResponse } from '../../providers/pts/dto/pts.dto';
import { ServiceCRM } from '../../providers/crm/crm.service';
import { ConsultarCRMDTO } from '../../providers/crm/dto/consultar/crmConsulRequest.dto';
import { KafkaTopicsConstants } from '../../modules/accounts/constants/api';
import { DepositResponseCRM } from 'src/providers/crm/dto/actualizar/crmActualResponse.dto';

const SERVICE_NAME = configuration().service.name;

@ApiTags(SERVICE_NAME)
@ApiHeader({
  name: 'Version-Header',
  enum: ['1'],
  description: 'please select a version',
  required: true,
})
@Controller({ path: 'account' })
export class AccountsController {
  constructor(
    private readonly accountService: AccountsService,
    private errorCustomizer: ErrorCustomizer,
    private logger: Logger,
    @Inject('KAFKA_CLIENT') private kafkaService: ClientKafka,
  ) {}

  @ApiOperation({
    summary: 'Fetch account Details by Client Id',
  })
  @ApiOkResponse({
    description: 'Account details fetched successfully',
    type: [AccountDetailsByClientIdResponse],
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid username or password for Mambu',
  })
  @ApiBadRequestResponse({
    description: 'Invalid payload for Mambu',
  })
  @ApiNotFoundResponse({
    description: 'Resource not found in Mambu',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @ConditionalAuditCreator({
    executionContext: {
      functionality: functionalities.GET_ACCOUNT_DETAILS_BY_CLIENT_ID,
      provider: 'MAMBU',
      actorType: ActorType.USER,
      operationType: [OperationType.EXTERNAL_API_CALL],
    },
    requestMap: {
      'query.clientId': 'actorId',
      'query.trackingId': 'trackingId',
    },
    outputMap: {
      id: 'executionContext.accountId',
      accountType: 'executionContext.accountType',
      state: 'executionContext.accountState',
    },
  })
  @Version('1')
  @Get()
  async accountDetailsByClientId(
    @Query()
    { clientId, accountState, trackingId }: AccountDetailsByClientIdDto,
  ): Promise<AccountDetailsByClientIdResponse[]> {
    try {
      this.logger.log('fetch account details for given clientId', trackingId);

      const accountDetails = await this.accountService.accountDetailsByClientId(
        clientId,
        accountState,
      );
      this.logger.log('account details fetched for given clientId', trackingId);

      return accountDetails;
    } catch (e) {
      throw this.errorCustomizer.customizeError(e, null, trackingId);
    }
  }

  @ApiOperation({
    summary: 'Fetch account numbers by client Id',
  })
  @ApiOkResponse({
    description: 'Account numbers fetched successfully',
    type: AccountNumbersByClientIdResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid username or password for Mambu',
  })
  @ApiBadRequestResponse({
    description: 'Invalid payload for Mambu',
  })
  @ApiNotFoundResponse({
    description: 'Resource not found in Mambu',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @ConditionalAuditCreator({
    executionContext: {
      functionality: functionalities.GET_ACCOUNT_NUMBERS_BY_CLIENT_ID,
      provider: 'MAMBU',
      actorType: ActorType.USER,
      operationType: [OperationType.EXTERNAL_API_CALL],
    },
    requestMap: {
      'query.clientId': 'actorId',
      'query.trackingId': 'trackingId',
    },
    outputMap: {
      accountNumbers: 'executionContext.accountNumbers',
    },
  })
  @Version('1')
  @Get('/account-numbers')
  async accountNumbersByClientId(
    @Query()
    { trackingId, externalCustomerId: clientId }: AccountNumbersByClientIdDto,
  ): Promise<AccountNumbersByClientIdResponse> {
    try {
      this.logger.log(`fetch account numbers for given clientId`, trackingId);

      const accounts = await this.accountService.accountNumbersByClientId(
        clientId,
      );
      this.logger.log(`account numbers fetched for given clientId`, trackingId);

      return accounts;
    } catch (e) {
      throw this.errorCustomizer.customizeError(e, null, trackingId);
    }
  }

  @ApiOperation({
    summary: 'Fetch account Details by Account Id',
  })
  @ApiOkResponse({
    description: 'Account details fetched successfully',
    type: AccountDetailsByAccountIdResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid username or password for Mambu',
  })
  @ApiBadRequestResponse({
    description: 'Invalid payload for Mambu',
  })
  @ApiNotFoundResponse({
    description: 'Resource not found in Mambu',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @ConditionalAuditCreator({
    executionContext: {
      functionality: functionalities.GET_ACCOUNT_DETAILS_BY_ACCOUNT_ID,
      provider: 'MAMBU',
      actorType: ActorType.USER,
      operationType: [OperationType.EXTERNAL_API_CALL],
    },
    requestMap: {
      'params.accountId': 'actorId',
      'query.trackingId': 'trackingId',
    },
    outputMap: {
      accountType: 'executionContext.accountType',
      state: 'executionContext.accountState',
    },
  })
  @Version('1')
  @Get(':accountId')
  async accountDetailsByAccountId(
    @Param()
    { accountId }: AccountDetailsByAccountIdDto,
    @Query()
    { trackingId }: AccountDetailsByAccountIdQueryDto,
    @RequestHeader(HeaderDTO) headers: HeaderDTO,
  ): Promise<AccountDetailsByAccountIdResponse> {
    try {
      this.logger.log(`header account details`, JSON.stringify(headers));
      this.logger.log(`fetch account details for given accountId`, trackingId);

      const accountDetails =
        await this.accountService.accountDetailsByAccountId(accountId);
      this.logger.log(
        `account details fetched for given accountId`,
        trackingId,
      );

      return accountDetails;
    } catch (e) {
      throw this.errorCustomizer.customizeError(e, null, trackingId);
    }
  }

  @ApiOperation({
    summary: 'Fetch account limits and accumulator by Account Id',
  })
  @ApiOkResponse({
    description: 'Account limits fetched successfully',
    type: AccountDetailsByAccountIdResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid username or password for PTS',
  })
  @ApiBadRequestResponse({
    description: 'Invalid payload for PTS',
  })
  @ApiNotFoundResponse({
    description: 'Resource not found in PTS',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @ConditionalAuditCreator({
    executionContext: {
      functionality: functionalities.GET_ACCOUNT_LIMITS_BY_CLIENT_ID,
      provider: 'PTS',
      actorType: ActorType.USER,
      operationType: [OperationType.EXTERNAL_API_CALL],
    },
    requestMap: {
      'params.accountId': 'accountId',
    },
    outputMap: {
      accountType: 'executionContext.accountType',
      state: 'executionContext.accountState',
    },
  })
  @Get(':accountId/accumulators')
  async accountLimitsByAccountId(
    @Param() accountId: string,
    @RequestHeader(HeaderDTO) headers: HeaderDTO,
  ): Promise<PtsResponse> {
    this.logger.log(
      `fetch account limits for given accountId ${accountId['accountId']} `,
      JSON.stringify(accountId),
    );
    try {
      const accountLimits =
        await this.accountService.getLimitsAccumulatorsByAccount(
          accountId['accountId'],
        );

      if (accountLimits.statusRS.code !== '0') {
        throw new ProviderException(accountLimits.statusRS.code);
      }
      this.logger.log(
        `account limits fetched for given accountId`,
        JSON.stringify(accountLimits),
      );

      return accountLimits;
    } catch (error) {
      if (error instanceof CustomException) {
        throw error;
      }
      throw new InternalServerExceptionDale(ErrorCodesEnum.ACN007, error);
    }
  }

  @Version('1')
  @Get('users/:userId/account-numbers')
  async getAccountsByUserId(
    @Param() { userId }: GetAccountsByUserIdRequestDto,
    @RequestHeader(HeaderDTO) headers: HeaderDTO,
  ): Promise<GetAccountsByUserIdDataResponseDto> {
    try {
      return await this.accountService.getAccountsByUserId(userId, headers);
    } catch (error) {
      this.logger.error('Error controller', error, headers.TransactionId);
      throw error;
    }
  }

  @ApiOperation({
    summary: 'Fetch certificate url from AWS S3 by templateName',
  })
  @ApiOkResponse({
    description: 'Certificate fetched successfully',
    type: GetCertificateResponseDto,
  })
  @Version('1')
  @Post('certificate/url')
  async getCertificate(
    @Body() inputData: GetCertificateStrategyDataInputDto,
    @RequestHeader(HeaderDTO) headers: HeaderDTO,
  ): Promise<GetCertificateResponseDto> {
    try {
      return await this.accountService.getCertificate(inputData, headers);
    } catch (error) {
      this.logger.error(
        'Error controller',
        error.message,
        headers.TransactionId,
      );
      if (error instanceof CustomException) throw error;
      throw new InternalServerExceptionDale(ErrorCodesEnum.ACN007, error);
    }
  }

  @ApiOperation({
    summary: 'Modify user account limits by accountNumber',
  })
  @ApiOkResponse({
    description: 'Modify user account limits successfully',
    type: AccountModifyLimitsResponse,
  })
  @Version('1')
  @Post('modify-limits')
  async modifyLimits(
    @Body() body: ModifyLimitsInputDto,
    @RequestHeader(HeaderDTO) headers: HeaderDTO,
  ): Promise<AccountModifyLimitsResponse> {
    try {
      return await this.accountService.modifyLimits(body, headers);
    } catch (error) {
      this.logger.error('Error controller', error, headers.TransactionId);
      throw error;
    }
  }

  //Panel Administrativo CRM
  @ApiOperation({
    summary: 'Account back office operations consult the electronic deposit',
  })
  @ApiOkResponse({
    description:
      'Account back office operations consult the electronic deposit successfully',
    type: AccountDetailsByAccountIdResponse,
  })
  @ApiUnauthorizedResponse({
    description:
      'Invalid Account back office operations consult the electronic deposit',
  })
  @ApiBadRequestResponse({
    description:
      'Invalid payload Account back office operations consult the electronic deposit',
  })
  @ApiNotFoundResponse({
    description:
      'Resource not found in Account back office operations consult the electronic deposit',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @ConditionalAuditCreator({
    executionContext: {
      functionality: functionalities.GET_CONSULT_THE_ELECTRONIC_DEPOSIT,
      provider: 'CRM',
      actorType: ActorType.USER,
      operationType: [OperationType.EXTERNAL_API_CALL],
    },
    requestMap: {
      'params.accountId': 'accountId',
    },
    outputMap: {
      accountType: 'executionContext.accountType',
      state: 'executionContext.accountState',
    },
  })
  @Get('api/sendSMS')
  async consultElectronicDeposit(
    @Query() params: ConsultarCRMDTO,
    @RequestHeader(HeaderDTO) headers: HeaderDTO,
  ): Promise<DepositResponseCRM> {
    try {
      this.logger.log(
        ` Ctrl Back office operations consult the electronic deposit for given`,
        JSON.stringify(params),
      );
      const reponseAccount = await this.accountService.consultDeposit(params);
      this.logger.log(
        `Response CRM operations consult the electronic deposit for given accountId`,
        JSON.stringify(reponseAccount),
      );
      return reponseAccount;
    } catch (error) {
      if (error instanceof CustomException) {
        throw error;
      }
      throw new InternalServerExceptionDale(ErrorCodesEnum.ACN007, error);
    }
  }

  @EventPattern(KafkaTopicsConstants.BACKOFFICE_TOPIC)
  async updateElectronicDeposit(
    @Ctx() context: KafkaContext,
    @Payload() eventObject: MessageEvent,
  ): Promise<string> {
    try {
      this.logger.log(
        `Event CRM operations update the electronic deposit for given accountId`,
        JSON.stringify(eventObject),
      );
      const incomingMessage = await this.accountService.validateMessageEvent(
        eventObject,
      );
      const respServiceUpdate = await this.accountService.updateDeposit(
        incomingMessage,
      );
      return respServiceUpdate;
    } catch (error) {
      if (error instanceof CustomException) {
        throw error;
      }
      throw new InternalServerExceptionDale(ErrorCodesEnum.ACN001, error);
    }
  }

  @EventPattern(KafkaTopicsConstants.BACKOFFICE_TOPIC_MAMBU)
  async EventElectronicDeposit(
    @Ctx() context: KafkaContext,
    @Payload() eventObject: MessageEvent,
  ): Promise<string> {
    try {
      this.logger.log(
        `Event CRM operations update the electronic deposit for given accountId`,
        JSON.stringify(eventObject),
      );
      const incomingMessage = await this.accountService.validateMessageEvent(
        eventObject,
      );
      const respServiceUpdate = await this.accountService.strategUpdateDeposit(
        incomingMessage,
      );
      return respServiceUpdate;
    } catch (error) {
      if (error instanceof CustomException) {
        throw error;
      }
      throw new InternalServerExceptionDale(ErrorCodesEnum.ACN001, error);
    }
  }
}
