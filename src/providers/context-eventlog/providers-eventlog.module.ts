import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from '@dale/logger-nestjs';
import { Module } from '@nestjs/common';

//Contexts
import { ProviderEventlogContext } from './eventlog-context';

//Strategies
import { IntrasolutionEventLogStrategy } from '../../modules/eventlog/strategies/intrasolution.strategy';
import { TransifyaEnviarEventLogStrategy } from '../../modules/eventlog/strategies/transfiya-enviar.strategy';
import { TransifyaRecibirEventLogStrategy } from '../../modules/eventlog/strategies/transfiya-recibir.strategy';
import { RetiroAtmOtpEventLogStrategy } from '../../modules/eventlog/strategies/retiro_otp.strategy';
import { UserModule } from '../user/user.module';
import { DaleModule } from '../dale/dale.module';

@Module({
  imports: [
    LoggerModule.forRoot({ context: 'Context Providers Module' }),
    HttpModule,
    UserModule,
    DaleModule,
  ],
  providers: [
    ProviderEventlogContext,
    IntrasolutionEventLogStrategy,
    TransifyaEnviarEventLogStrategy,
    TransifyaRecibirEventLogStrategy,
    RetiroAtmOtpEventLogStrategy,
  ],
  exports: [ProviderEventlogContext],
})
export class ProvidersEventLogModule {}
