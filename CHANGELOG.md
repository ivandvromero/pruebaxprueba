## [0.9.0]

- Se hizo un ajuste en la configuracion de la base de datos para evitar superar limite de conexiones

## [0.8.0]

- [OFDD20-1852] Se agrego la columna fullMigration a la tabla user, para validar si el usuario es de dale2 o dale1 y si realizo la migracion
- [OFDD20-1670] Se agrego end-point para actualizar datos de ubicacion de usuario
- [OFDD20-1670] Se agrego end-point para ver los requerimientos del usuario
- Se eliminaron los archivos de manejo de errores locales y se implemento unicamente el uso de la libreria de Dale

## [0.7.3]

- [OFDD20-1701] Se agrega servicio de health check para redis.
- [OFDD20-1748] Se agrega metodo removeAccents para eliminar caracteres especiales de los nombres almacenados en BD.

## [0.7.2]

- [TRANSFE-1190] Fixed eliminate favourite message again, the point was missing
- [TRANSFE-1190] Changed the success message for eliminate favourite
- log de conexiones de base de datos cerradas eliminado.
- [PYCD20-1113] Se agrega un nuevo filtro opcional (idUser) en el metodo get ya existente.

## [0.7.1]

- UserAgent en headetDto como optional.

## [0.7.0]

- [TRANSFE-989] Se agrega el EventLog para crear o eliminar favoritos.

## [0.6.4]

- Actualización logs transaccionales

## [0.6.3]

- Se implementa el cache en redis para almacenar el nombre de documento en el servicio de configuración.

## [0.6.2]

- Se agrega servicio de configuración para traer el tipo de documento.
- Se modifica la creación de los usuarios para almacenar la hora de colombia en los valores createAt y updateAt.
- Enviar a colca de kafka, informacion del paso de enrolamiento que se esta ejecutando

## [0.6.1]

- Cola de reintentos para las peticiones de actualizacion db de user

## [0.6.0]

- [OFDD20-973] Se agrega servicio para envío de logs a sqs luego actualizar el usuario con los datos de PTS.
- Se mofifica en el servicio que atiende el topico user.update.user para recibir headers del evento de kafka.
- Se modifica en el servicio que elimina favortis agregandole un nuevo parametro usersid
- Se agrego nuevas columnas en la tabla de user (gender y usergender)

## [0.5.0]

- [OFDD20-1185] Se añadio el campo de deviceId a la tabla user

## [0.4.0]

- Agregar cambios obligatorios en tabla users

## [0.3.2]

- Se adiciona Version-Header

## [0.3.1]

- FIX - Ordenar favoritos por alias

## [0.3.0]

- [OFDD20-248] Onboarding Paso 1 - Validación de identidad de usuario y filtros (flujo feliz usuarios no PEP) - Persona natural
- [OFDD20-248] Intg. Onboarding Paso 2 Validación de Celular
- [TRANSFE-65] Agregar filtros de busqueda de usuario celular, documento y numero de deposito

## [0.2.0]

- TRANSFE-111 -> Servicio para administrar favoritos

## [0.1.1]

- OFDD20-335 -> Back- Validar longitud maxima numero del deposito
- OFDD20-336 -> Back- Validar longitud maxima numero de telefono
- OFDD20-337 -> Back- Validar solo numero en numero del deposito
- OFDD20-338 -> Back- Validar solo numero en numero de telefono

## [0.1.0]

- HU OFDD20-24 -> Back- Validar existencia del cliente en dale! 2.0

## [0.0.1]

Base LeapX
