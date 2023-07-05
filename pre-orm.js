/**
 * Executed to run migrations with required AWS tokens in the ORM config
 */

/* eslint-disable @typescript-eslint/no-var-requires */
// require('shared/config/env/env.config');

const AWS = require('aws-sdk');
const fs = require('fs');

const getAuthToken = () => {
  if (!(process.env.TYPEORM_HOST && process.env.CLOUD_SERVICE_PROVIDER?.toUpperCase() === 'AWS' )) {
    return
  }

  const signer = new AWS.RDS.Signer({
    region: process.env.AWS_REGION,
    hostname: process.env.TYPEORM_HOST,
    port: parseInt(process.env.TYPEORM_PORT, 10),
  });

  signer.getAuthToken(
    {
      username: 'user',
    },
    (err, token) => {
      if (err) console.log(err);
      fs.writeFileSync(
        `userToken`,
        token,
      );
    },
  );
};

getAuthToken();
