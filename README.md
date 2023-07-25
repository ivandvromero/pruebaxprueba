# Backoffice Microservice

In this readme you will find all information related with backofficce microservice

## Requirements

Before using this microservice, we recommend having postgres.
If not we recommend to use a Docker image.

# <a name="Node-package-installation">Node package :package: installation</a>

Before installing npm dependencies, follow these steps carefully.

- Install [AWS Command Line Interface version 2](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html 'AWS Command Line Interface') (AWS CLI) :link:.

- In your terminal :computer: execute the command `aws configure` and complete the following data, please request these from the technical lead.

```shell
$ aws configure
AWS Access Key ID [None]: XXXXXXXXXXX
AWS Secret Access Key [None]:  XXXXXXXXXXXXXXXXXXXXXX
Default region name [None]: XXXXXXX
Default output format [None]: json
```

- In your visual studio code terminal :computer: run the command `npm install` in the root of the project.

- If you get any errors with aws:
  run this command first `npm run co:login` and then `npm install`

# <a name="Environment-Variables">Environment Variables :earth_americas:</a>

Your team can share these files with you but, if you're starting fresh, you will need to create them yourself:

- Create `dev.env` and `test.env` files in the root directory. Use the [dev.env.template](./dev.env.template) :link: and [test.env.template](./test.env.template) :link: for reference and add your secrets.

# <a name="Run-the-microservice-in-local-environment">Run :bicyclist: the microservice in local environment</a>

- run the following command to start the microservice :computer:

```shell
npm run start
```

- Run the following command if you want to run the microservice in developer mode :computer:

```shell
npm run start:dev
```

- You can access the documentation once the microservice is running through the following urls. [http://localhost:5003/docs]('http://localhost:5003/docs') :link:

# <a name="Running-tests">Running :bicyclist: tests</a>

To run the tests, you can run any of the following commands :computer: :

```shell
npm run test
```

```shell
npm run test:cov
```

```shell
npm run test:watch
```

```shell
npm run test:debug
```

```shell
npm run test:e2e
```

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# <a name="Auth Service">Auth Service</a>

To validate users you must include:

```js
import { Auth0Guard } from '@auth/auth.guard';
import { PermissionsGuard } from '@auth/permission.guard';
import { Permissions } from '@auth/permissions.decorator';

export class controller{
  @UseGuards(Auth0Guard, PermissionsGuard)
  @Permissions('MonetaryAdjustment:write', 'MonetaryAdjustment:read')
  async Controller(){} 
}
```
