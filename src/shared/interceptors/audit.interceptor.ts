import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Optional,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { DynamodbService } from '@dale/aws-nestjs';
import { randomUUID } from 'crypto';
import { Logger } from '@dale/logger-nestjs';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private dynamoDB: DynamodbService,
    @Optional() private logger: Logger,
  ) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const httpContext = context.getArgs()[0];
    const key = `BackOffice#${randomUUID()}`;
    const auditData = {
      PK: key,
      SK: key,
      METADATA: {
        route: httpContext.url,
        version: httpContext.httpVersion,
        time: new Date().toISOString(),
        ip: context.switchToHttp().getRequest().headers['X-Forwarded-For'],
        user: httpContext.user.email,
      },
    };
    try {
      await this.dynamoDB.insertItem<any>(auditData);
    } catch (error) {
      this.logger.error(`Error creating audit service ${error.message}`);
    }
    return next.handle();
  }
}
