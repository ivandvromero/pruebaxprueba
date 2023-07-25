import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

const filename = process.env.NODE_ENV === 'test' ? 'test.env' : '.env';
const tsPath = path.resolve(__dirname, `../../${filename}`);
const jsPath = path.resolve(__dirname, `../../../${filename}`);
dotenv.config({ path: fs.existsSync(tsPath) ? tsPath : jsPath });

const SECRET_CONFIG = {
  documentation: 'SECRET_DOC_CONFIG',
  api: 'SECRET_CONFIG',
};

const setupEnvConfig = () => {
  switch (
    process.env.CLOUD_SERVICE_PROVIDER &&
    process.env.CLOUD_SERVICE_PROVIDER.toUpperCase()
  ) {
    case 'AWS':
      return (process.env = {
        ...process.env,
        ...(SECRET_CONFIG[process.env.SERVICE_TYPE] &&
        process.env[SECRET_CONFIG[process.env.SERVICE_TYPE]]
          ? JSON.parse(process.env[SECRET_CONFIG[process.env.SERVICE_TYPE]])
          : {}),
      });
    default:
      return process.env;
  }
};

setupEnvConfig();
