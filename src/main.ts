import './config/env.config';
import { registerSwagger } from '@dale/shared-nestjs/utils/swagger';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@dale/logger-nestjs';
import { AuditInterceptor } from '@dale/shared-nestjs/utils/audit/audit-interceptor';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import * as AWSXRay from 'aws-xray-sdk';
import serviceConfiguration from './config/service-configuration';
import { AccountServiceModule } from './account-service.module';
import { KAFKA_CLIENT_CONFIG } from './config/kafka';

const logger = new Logger({ context: 'Account Service' });
const isAWS =
  serviceConfiguration().service.cloud_service_provider.toUpperCase() === 'AWS';

async function bootstrap() {
  const configFactory = {};
  if (isAWS) {
    AWSXRay.setDaemonAddress(serviceConfiguration().aws.xray_daemon_address);
    AWSXRay.config([AWSXRay.plugins.EC2Plugin, AWSXRay.plugins.ECSPlugin]);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    AWSXRay.captureHTTPsGlobal(require('https'));
    AWSXRay.setContextMissingStrategy('LOG_ERROR');
    Object.assign(configFactory, {
      httpsOptions: {
        key: serviceConfiguration().aws.private_key.replace(/\\n/gm, '\n'),
        cert: serviceConfiguration().aws.public_key.replace(/\\n/gm, '\n'),
      },
    });
  }

  const app = await NestFactory.create(AccountServiceModule, configFactory);

  if (isAWS) {
    app.use(AWSXRay.express.openSegment(serviceConfiguration().service.name));
  }

  if (serviceConfiguration().service.auditable === 'true') {
    app.useGlobalInterceptors(
      new AuditInterceptor(serviceConfiguration().service.name),
    );
  }
  app.useGlobalPipes(new ValidationPipe());
  app.useLogger(app.get(Logger));
  app.enableVersioning({
    type: VersioningType.HEADER,
    header: 'Version-Header',
  });
  if (isAWS) {
    app.use(AWSXRay.express.closeSegment());
  }
  registerSwagger(app, serviceConfiguration().service.name);
  app.connectMicroservice(KAFKA_CLIENT_CONFIG);
  await app.startAllMicroservices();
  if (isAWS) {
    app.use(AWSXRay.express.closeSegment());
  }
  await app.listen(serviceConfiguration().service.port || 3000);
  logger.log(`Microservice is listening on: ${await app.getUrl()}`);
}
bootstrap().catch((err) => {
  logger.error(err);
});
