# Users Microservice

In this readme you know all inofrmation related with users microservice.

* Read this in other languages: [Spanish](README.esp.md).

# Table of Contents
  - [Requirements :page_facing_up:](#Requirements)
  - [Node package :package: installation](#Node-package-installation)
  - [Environment Variables :earth_americas:](#Environment-Variables)
  - [Run :bicyclist: the microservice in local environment ](#Run-the-microservice-in-local-environment)
  - [Running :bicyclist: tests](#Running-tests)
  - [Migrations :rocket:](#Migrations)
  - [Run Docker :anchor:](#Run-Docker)
  - [Project structure :file_folder:](#Project-structure)
  - [Good practices :surfer: :sunglasses:](#Good-practices)

# <a name="Requirements">Requirements :page_facing_up:</a> 

Before to start the microservice, We recommend having Postgres, Kafka and Redis installed. Either in Docker or the url exposed by dale.

remember to update the paths in the .env file

install [Node.js](https://nodejs.org/es/ 'Node') :link: on version 16.17.0

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

- You can access the documentation once the microservice is running through the following urls. [http://localhost:5001/docs]('http://localhost:5001/docs') :link:

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

# <a name="Migrations">Migrations :rocket:</a> 

If the microservice has a database connection configured, the following commands must be executed, depending on your need.

- To apply the migrations to our database, run the following command :computer: :

```shell
npm run typeorm:migrate
```

- To perform some rollback of a database migration, run the following command :computer: :

```shell
npm run typeorm:revert
```

- To create a new migration, run the following command :computer: :

```shell
npm run typeorm:generate src/db/migration/name-migration
```
- Replace name-migration with the name you want to give the new migration.

# <a name="Run-Docker">Run Docker :anchor:</a>

In progress

# <a name="Project-structure">Project structure :file_folder:</a>  

```sh
user-nestjs-ms/
├── src              # In this folder is the application code
      ├── config
      ├── constants
      ├── db
      ├── modules
      ├── unitTesting
      ├── shared
      ├── utils
      ├── main.ts
      ├── user-service.module.ts
├── test
├── dev.env
├── ormconfig.ts
├── package.json
```
# <a name="Good-practices">Good practices :surfer: :sunglasses:</a> 

Remember that all code you write in this microservice must be in English, including comments.

Do not forget that the description of the commit's must also be in English  and the message must be descriptive with the code that you are going to upload.