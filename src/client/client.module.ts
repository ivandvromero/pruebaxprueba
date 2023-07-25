import { CacheModule, Module } from '@nestjs/common';
import { MambuConnector } from '../shared/providers/mambu-connector-adapter/mambu-connector';
import { LoggerModule } from '@dale/logger-nestjs';
import { ClientController } from './modules/controllers/client.controller';
import { ClientService } from './modules/services/client.service';
import { TransactionService } from './modules/services/transaction.service';
import {
  GetAccountByClientIdUseCase,
  GetClientByIdUseCase,
  GetClientByMultipleFieldsUseCase,
  GetTransactionChanelsUseCase,
  GetClientByDepositNumberUseCase,
  SendTransactionUseCase,
  GetTransactionByMultipleFieldsUseCase,
  GetAccountByIdentificationNumberUseCase,
  GetTransactionsWithHeadersUseCase,
} from './use-cases';
import { AxiosAdapter } from '../shared/providers/http-adapters/axios-adapter';
import { ConfigModule } from '@nestjs/config';
import config from '../configuration/configuration';
import { DynamodbModule, SecretsManagerService } from '@dale/aws-nestjs';
import { DYNAMO_TABLE } from '../shared/constants/constants';

import { CRMConnector } from '../shared/providers/crm-connector-adapter/crm-connector';
import { TransactionController } from './modules/controllers/transaction.controller';
import {
  GetCardsByAccountPartyUseCase,
  GetNaturalPersonUseCaseByParams,
  GetDepositByDepositNumber,
} from './use-cases/crm';
import { CoreQueryConnector } from './common/ports/core-query-connector.interface';
import { CoreTransactionConnector } from './common/ports/core-transaction-connector.interface';
import { MambuService } from './modules/services/mambu.service';
import { GetClientByIdentificationNumberUseCase } from './use-cases/get-client-by-identification-number-use-case';
import { GetClientEnrollmentUseCase } from './use-cases/crm/get-client-enrollment.use-case';
import { Auth0Service } from '../shared/providers/auth0-management-api/auth-services/auth0-service';
import { Auth0Connector } from '../shared/providers/auth0-management-api/connector/auth0-connector';
import { SecretsManager } from 'src/shared/secrets-manager/secrets-manager';
import { PtsConnectorModule } from '@dale/pts-connector/pts-conector.module';
import { KAFKA_CLIENT_CONFIG } from 'src/configuration/kafka';
import { ClientsModule } from '@nestjs/microservices';

@Module({
  imports: [
    LoggerModule.forRoot({
      context: 'Client Module',
    }),
    ConfigModule.forRoot({
      envFilePath: 'dev.env',
      load: [config],
      isGlobal: true,
    }),
    CacheModule.register({
      ttl: 86400,
      max: 10,
    }),
    DynamodbModule.forRoot({ tableName: DYNAMO_TABLE }),
    PtsConnectorModule,
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        ...KAFKA_CLIENT_CONFIG,
      },
    ]),
  ],
  providers: [
    ClientService,
    TransactionService,
    Auth0Service,
    MambuService,
    GetClientByIdUseCase,
    GetClientByMultipleFieldsUseCase,
    GetTransactionChanelsUseCase,
    GetAccountByClientIdUseCase,
    GetClientByDepositNumberUseCase,
    SendTransactionUseCase,
    GetClientByIdentificationNumberUseCase,
    GetTransactionsWithHeadersUseCase,
    GetTransactionByMultipleFieldsUseCase,
    GetNaturalPersonUseCaseByParams,
    GetCardsByAccountPartyUseCase,
    GetClientEnrollmentUseCase,
    GetDepositByDepositNumber,
    GetAccountByIdentificationNumberUseCase,
    AxiosAdapter,
    CRMConnector,
    Auth0Connector,
    SecretsManager,
    SecretsManagerService,
    {
      provide: CoreQueryConnector,
      useClass: MambuConnector,
    },
    {
      provide: CoreTransactionConnector,
      useClass: MambuConnector,
    },
  ],
  controllers: [ClientController, TransactionController],
  exports: [TransactionService],
})
export class ClientModule {}
