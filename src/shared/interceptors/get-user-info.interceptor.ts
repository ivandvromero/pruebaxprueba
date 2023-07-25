import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { userLevel } from '@dale/monetary-adjustment/shared/common';
import { UserInfoInterface } from '@dale/monetary-adjustment/shared/interfaces/user-info.interface';

@Injectable()
export class UserInfoInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();

    const audience = this.configService.get('config.auth.audience');
    const role = req.user[`${audience}roles`][0];

    const userInfo: UserInfoInterface = {
      email: req.user.email,
      name: req.user.name,
      role: role,
      transactionLevel: userLevel[role],
    };

    req.userInfo = userInfo;

    return next.handle();
  }
}
