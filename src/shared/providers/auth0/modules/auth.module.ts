import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../../../configuration/configuration';
import { Auth0Module } from './auth/auth0.module';
import { Auth0Guard } from './auth/auth.guard';
@Module({
  imports: [
    Auth0Module,
    ConfigModule.forRoot({
      ignoreEnvFile: false,
      isGlobal: true,
      load: [configuration],
    }),
  ],
  controllers: [],
  providers: [Auth0Guard],
  exports: [Auth0Guard],
})
export class AuthModule {}
