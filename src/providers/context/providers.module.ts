import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from '@dale/logger-nestjs';
import { CacheModule, Module } from '@nestjs/common';

//Modules
import { CrmModule } from '../crm/crm.module';
import { UserModule } from '../user/user.module';
import { DaleModule } from '../dale/dale.module';
import { CardModule } from '../card/card.module';
import { EnrollmentNaturalPersonModule } from '../enrollment-natural-person/enrollment-np.module';

//Contexts
import { ProviderContext } from './provider-context';

//Strategies
import { IntrasolutionStrategy } from '../../modules/monitor/strategies/intrasolution.strategy';
import { TransfiyaEnviarStrategy } from '../../modules/monitor/strategies/transfiya-enviar.strategy';
import { TransifyaRecibirStrategy } from '../../modules/monitor/strategies/transfiya-recibir.strategy';
import { Cell2cellEnviarStrategy } from '../../modules/monitor/strategies/cell-to-cell-enviar.strategy';

@Module({
  imports: [
    LoggerModule.forRoot({ context: 'Context Providers Module' }),
    HttpModule,
    CacheModule.register({
      isGlobal: true,
    }),
    CrmModule,
    UserModule,
    EnrollmentNaturalPersonModule,
    DaleModule,
    CardModule,
  ],
  providers: [
    ProviderContext,
    TransfiyaEnviarStrategy,
    TransifyaRecibirStrategy,
    Cell2cellEnviarStrategy,
    IntrasolutionStrategy,
  ],
  exports: [ProviderContext],
})
export class ProvidersModule {}
