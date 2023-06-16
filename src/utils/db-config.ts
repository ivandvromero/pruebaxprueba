import * as AWS from 'aws-sdk';

export const getAWSToken = async (signer): Promise<string> => {
  return new Promise((resolve, reject) => {
    signer.getAuthToken({}, (err, token) => {
      if (err) return reject(err);
      return resolve(token);
    });
  });
};

export const getDbConfig = async (username: string) => {
  switch (process.env.CLOUD_SERVICE_PROVIDER.toUpperCase()) {
    case 'AWS': {
      const signer = new AWS.RDS.Signer({
        region: process.env.AWS_REGION,
        hostname: process.env.TYPEORM_HOST,
        port: parseInt(process.env.TYPEORM_PORT, 10),
        username: username,
      });
      return {
        password: await getAWSToken(signer),
        username: username,
        ssl: true,
        extra: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
      };
    }
    default:
      return {};
  }
};
