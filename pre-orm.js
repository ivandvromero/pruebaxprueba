// eslint-disable-next-line @typescript-eslint/no-var-requires
const AWS = require('aws-sdk');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

const getAuthToken = () => {
  if (
    !(
      process.env.TYPEORM_HOST &&
      process.env.CLOUD_SERVICE_PROVIDER?.toUpperCase() === 'AWS'
    )
  ) {
    return;
  }

  const signer = new AWS.RDS.Signer({
    region: process.env.AWS_REGION,
    hostname: process.env.TYPEORM_HOST,
    port: parseInt(process.env.TYPEORM_PORT, 10),
  });

  signer.getAuthToken(
    {
      username: 'backoffice',
    },
    (err, token) => {
      if (err) console.log(err);
      fs.writeFileSync(`backofficeToken`, token);
    },
  );
};

getAuthToken();
