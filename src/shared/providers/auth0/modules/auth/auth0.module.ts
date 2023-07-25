import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { Auth0Strategy } from './auth0.strategy';
import { PassportModule } from '@nestjs/passport';
import { LoggerModule } from '@dale/logger-nestjs';
import { Auth0Guard } from './auth.guard';
import { PermissionsGuard } from './permission.guard';
import { AuthService } from './auth.service';

@Module({
  imports: [
    HttpModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    LoggerModule.forRoot({ context: 'Auth module' }),
  ],
  providers: [Auth0Strategy, Auth0Guard, PermissionsGuard, AuthService],
  exports: [
    PassportModule,
    Auth0Strategy,
    Auth0Guard,
    PermissionsGuard,
    AuthService,
  ],
})
export class Auth0Module {}
