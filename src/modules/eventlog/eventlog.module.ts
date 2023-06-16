//Libraries
import { Module } from '@nestjs/common';
import { LoggerModule } from '@dale/logger-nestjs';
import { ClientsModule } from '@nestjs/microservices';

//Controllers
import { EventLogController } from './eventlog.controller';

//Services
import { EventLogService } from './eventlog.service';
import { EventSQSService } from '../../providers/context-eventlog/event-log/event-log-service';

//Modules
import { DaleModule } from '../../providers/dale/dale.module';
import { ProvidersEventLogModule } from '../../providers/context-eventlog/providers-eventlog.module';

//Configurations
import { KAFKA_CLIENT_PTS_CONFIG_EVENTLOG } from '../../config/kafka';

@Module({
  imports: [
    LoggerModule.forRoot({ context: 'Event log Module' }),
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT_EVENTLOG',
        ...KAFKA_CLIENT_PTS_CONFIG_EVENTLOG,
      },
    ]),
    ProvidersEventLogModule,
    DaleModule,
  ],
  controllers: [EventLogController],
  providers: [EventLogService, EventSQSService],
})
export class EventLogModule {}
