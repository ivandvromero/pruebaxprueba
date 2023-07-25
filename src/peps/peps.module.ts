import { Module } from '@nestjs/common';
import { FindPepsWithPendingService } from './modules/services/find-peps-with-pending.service';
import { FindPepsWithPendingController } from './modules/controllers/find-peps-with-pending.controller';
import { HistoricalPepsService } from './modules/services/historical-peps.service';
import { HistoicalPepsController } from './modules/controllers/historical-peps.controller';
import { PepsValidationsService } from './modules/services/peps-validations.service';
import { PepsLevel } from './modules/chain-handlers/handlers/peps-level';
import { PepsDispatch } from './modules/chain-handlers/handlers/peps-dispatch';
import { PepsValidationsController } from './modules/controllers/peps-validations.controller';
import { PepsRepository } from './repository/peps.repository';
import { DatabaseService } from '../shared/db/connection/connection.service';
import { LoggerModule } from '@dale/logger-nestjs';
import { DYNAMO_TABLE } from '../shared/constants/constants';
import { DynamodbModule } from '@dale/aws-nestjs';

@Module({
  imports: [
    LoggerModule.forRoot({
      context: 'Peps Module',
    }),
    DynamodbModule.forRoot({ tableName: DYNAMO_TABLE }),
  ],
  providers: [
    FindPepsWithPendingService,
    HistoricalPepsService,
    PepsValidationsService,
    PepsLevel,
    PepsDispatch,
    PepsRepository,
    DatabaseService,
  ],
  controllers: [
    FindPepsWithPendingController,
    HistoicalPepsController,
    PepsValidationsController,
  ],
})
export class PepsModule {}
