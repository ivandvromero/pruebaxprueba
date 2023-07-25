# Microservicio de Usuarios

En este archivo README encontraras toda la información relacionada con el microservicio de usuarios.

* Lee esto en otros idiomas: [English](README.md).

# Tabla de contenido
  - [Requerimientos :page_facing_up:](#Requirements)
  - [Instalacion de paquetes :package: Node](#Node-package-installation)
  - [Variables de entorno :earth_americas:](#Environment-Variables)
  - [Ejecutar :bicyclist: el microservicio en ambiente local ](#Run-the-microservice-in-local-environment)
  - [Corriendo :bicyclist: las pruebas unitarias](#Running-tests)
  - [Migraciones :rocket:](#Migrations)
  - [Corriendo Docker :anchor:](#Run-Docker)
  - [Estructura del proyecto :file_folder:](#Project-structure)
  - [Buenas practicas :surfer: :sunglasses:](#Good-practices)

# <a name="Requirements">Requerimientos :page_facing_up:</a> 

Antes de iniciar el microservicio, recomendamos tener instalado Postgres, Kafka y Redis. Ya sea en Docker o en la url expuesta por dale.

Recuerda actualizar las rutas en el archivo .env

Instala [Node.js](https://nodejs.org/es/ 'Node') :link: en la version 16.17.0

# <a name="Node-package-installation">Instalacion de paquetes :package: Node</a>   

Antes de instalar las dependencias de npm, siga estos pasos cuidadosamente.

- Instala [AWS Command Line Interface version 2](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html 'AWS Command Line Interface') (AWS CLI) :link:.

- En tu terminal :computer: ejecuta el comando `aws configure` y completa los siguientes datos, solicitalos al líder técnico.

```shell
$ aws configure
AWS Access Key ID [None]: XXXXXXXXXXX
AWS Secret Access Key [None]:  XXXXXXXXXXXXXXXXXXXXXX
Default region name [None]: XXXXXXX
Default output format [None]: json
```


- En tu terminal de Visual Studio Code :computer: ejecuta el comando `npm install` en la raíz del proyecto.

- Si obtiene algún error con aws:
ejecuta este comando primero `npm run co:login` y luego `npm install`.

# <a name="Environment-Variables">Variables de entorno :earth_americas:</a>  

Tu equipo puede compartirte estos archivos pero, si está comenzando desde cero, deberás crearlos:

- Crea los archivos `dev.env` y `test.env` en el directorio raíz. Usa [dev.env.template](./dev.env.template) :link: y [test.env.template](./test.env.template) :link: como referencia y agrega tus secretos.

# <a name="Run-the-microservice-in-local-environment">Ejecutar :bicyclist: el microservicio en ambiente local</a>   

- Ejecuta el siguiente comando para iniciar el microservicio :computer:

```shell
npm run start
```

- Ejecuta el siguiente comando si deseas ejecutar el microservicio en modo desarrollador :computer:

```shell
npm run start:dev
```

- Puedes acceder a la documentación una vez que el microservicio se esté ejecutando a través de las siguientes direcciones URL. [http://localhost:5001/docs]('http://localhost:5001/docs') :link:

# <a name="Running-tests">Corriendo :bicyclist: las pruebas unitarias</a> 

Para ejecutar las pruebas, puedes ejecutar cualquiera de los siguientes comandos :computer: :

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

# <a name="Migrations">Migraciones :rocket:</a> 

Si el microservicio tiene una conexión de base de datos configurada, se deben ejecutar los siguientes comandos, según tu necesidad.

- Para aplicar las migraciones a nuestra base de datos ejecuta el siguiente comando :computer: :

```shell
npm run typeorm:migrate
```

- Para realizar algun reverso de una migración de base de datos, ejecuta el siguiente comando :computer: :

```shell
npm run typeorm:revert
```

- Para crear una nueva migración, ejecuta el siguiente comando :computer: :

```shell
npm run typeorm:generate src/db/migration/name-migration
```
- Reemplace name-migration con el nombre que deseas darle a la nueva migración.

# <a name="Run-Docker">Corriendo Docker :anchor:</a>

En Progreso

# <a name="Project-structure">Estructura del proyecto :file_folder:</a>  


```sh
user-nestjs-ms/
├── src              # En esta carpeta se encuentra el codigo de la aplicacion
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
# <a name="Good-practices">Buenas practicas :surfer: :sunglasses:</a> 

Recuerda que todo el código que escribas en este microservicio debe estar en inglés, incluidos los comentarios.

No olvides que la descripción de los commit's también debe estar en inglés y el mensaje debe ser descriptivo con el código que vas a subir.