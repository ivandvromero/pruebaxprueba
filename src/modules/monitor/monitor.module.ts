import { Module } from '@nestjs/common';
import { MonitorController } from './monitor.controller';
import { MonitorService } from './monitor.service';
import { LoggerModule } from '@dale/logger-nestjs';
import { KAFKA_CLIENT_PTS_CONFIG_MONITOR } from '../../config/kafka';
import { ClientsModule } from '@nestjs/microservices';
import { CrmModule } from '../../providers/crm/crm.module';
import { EnrollmentNaturalPersonModule } from '../../providers/enrollment-natural-person/enrollment-np.module';
import { UserModule } from '../../providers/user/user.module';
import { ProvidersModule } from '../../providers/context/providers.module';
import { DaleModule } from '../../providers/dale/dale.module';

@Module({
  imports: [
    ProvidersModule,
    LoggerModule.forRoot({ context: 'Monitor Module' }),
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT_MONITOR',
        ...KAFKA_CLIENT_PTS_CONFIG_MONITOR,
      },
    ]),
    CrmModule,
    EnrollmentNaturalPersonModule,
    UserModule,
    DaleModule,
  ],
  controllers: [MonitorController],
  providers: [MonitorService],
})
export class MonitorModule {}
