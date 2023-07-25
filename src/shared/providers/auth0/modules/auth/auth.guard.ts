import { AuthGuard } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { isAuthDisabled } from '../../../../utils/auth.disabled';

@Injectable()
export class Auth0Guard extends AuthGuard('jwt') {
  handleRequest(err, user) {
    if (err) {
      throw err;
    }
    if (!isAuthDisabled() && !user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
