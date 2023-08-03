//Libraries
import { CacheModule, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from '@dale/logger-nestjs';

//Modules
import { PtsModule } from '../pts/pts.module';
import { AccountsDbModule } from '../../db/accounts/accounts.module';
import { AdlModule } from '../adl/adl.module';
import { REDIS_CONFIG } from '../../config/redis';
import { DaleModule } from '../dale/dale.module';

//Services
import { ContextProviderService } from './context-provider.service';

@Module({
  imports: [
    PtsModule,
    AccountsDbModule,
    HttpModule,
    LoggerModule.forRoot({ context: 'Accounts Service' }),
    AdlModule,
    CacheModule.register(REDIS_CONFIG),
    DaleModule,
  ],
  providers: [ContextProviderService],
  exports: [ContextProviderService],
})
export class ContextProviderModule {}
