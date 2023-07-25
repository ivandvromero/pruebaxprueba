import { Logger } from '@dale/logger-nestjs';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { BackOfficeModule } from './backoffice.module';
import * as AWSXRay from 'aws-xray-sdk';
import { registerSwagger } from '@dale/shared-nestjs/utils/swagger';
import { KAFKA_CLIENT_CONFIG } from './configuration/kafka';

const logger = new Logger({ context: 'BackOffice Module' });
const isAWS = process.env.CLOUD_SERVICE_PROVIDER?.toUpperCase() === 'AWS';

async function bootstrap() {
  const configFactory = {};
  if (isAWS) {
    AWSXRay.setDaemonAddress(process.env.AWS_XRAY_DAEMON_ADDRESS);
    AWSXRay.config([AWSXRay.plugins.EC2Plugin, AWSXRay.plugins.ECSPlugin]);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    AWSXRay.captureHTTPsGlobal(require('https'));
    AWSXRay.setContextMissingStrategy('LOG_ERROR');
    Object.assign(configFactory, {
      httpsOptions: {
        key: process.env.CERTIFICATE_PRIVATE_KEY.replace(/\\n/gm, '\n'),
        cert: process.env.PUBLIC_CERTIFICATE.replace(/\\n/gm, '\n'),
      },
    });
  }
  const app = await NestFactory.create(BackOfficeModule, configFactory);

  app.enableCors();

  if (isAWS) {
    app.use(AWSXRay.express.openSegment('backoffice-service'));
  }

  app.enableVersioning({
    type: VersioningType.HEADER,
    header: 'ApiVersion',
  });

  app.useLogger(app.get(Logger));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  registerSwagger(
    app,
    process.env.SERVICE_NAME,
    'https://gold-sunset-548192.postman.co/workspace/Dale-2.0~452baeec-8b38-4fc4-b90b-a1863f6d81b2/collection/25545788-30e4b48b-8d9a-4e86-a5ff-65c1599b68a8?action=share&creator=26014824',
  );
  app.connectMicroservice(KAFKA_CLIENT_CONFIG);
  await app.startAllMicroservices();

  if (isAWS) {
    app.use(AWSXRay.express.closeSegment());
  }

  await app.listen(process.env.SERVICE_PORT || 3000);
  logger.log(`🚀 Server running on port: ${process.env.SERVICE_PORT || 3000}`);
}
bootstrap();
