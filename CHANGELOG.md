## [0.8.0]


## [0.7.5]

- [TRANSFE-247] FIX - Convert string to boolean in field withBalance and fetch document type name from configuration. Depends on microservice configuration-nestjs-ms version [0.13.0]

## [0.7.4]

- [TRANSFE-376] Fixed name for table header field in account statements strategy
- [TRANSFE-1570] Added strategy for account statements PDF generation
- [TRANSFE-1478] Integración ADL check trx
- [TRANSFE-247] Estrategia para generar información del certificado de depósito electrónico y obtener url del archivo pdf del bucket S3. Depende de información de la cuenta en PTS, de la tabla Account de base de datos PostgreSQL y del microservicio pdfgenerate-nestjs-ms [0.1.0]. 
- Se ajusta la configuración del health check para redis.
- Se ajusta la feach-hora del logs transaccional.
- [TRANSFE-693] Se agrego query y mutation para el tema de topes de cuenta de usuario y se modifico respuesta tal cual como lo requeria el front

## [0.7.3]

- Se elimina logs al cerrar conexión de base de datos.
- Se ajusta valor de refresh token pts para ambiente PRD 

## [0.7.2]
- Se agrega servicio de configuración para traer el tipo de documento.
- Se modifica la creación de los usuarios para almacenar la hora de colombia en los valores updateAt.
- Enviar a colca de kafka, informacion del paso de enrolamiento que se esta ejecutando
## [0.7.1]

- [OFDD20-1403] Se implementa servicio de health check
- Cola de reintentos para los eventos de kafka fallidos para los servicios de enrollment natural person

## [0.7.0]

- [OFDD20-973] Se agrega servicio para envío de logs a sqs luego de crear la cuenta en PTS
- Se agrega servicio para hacer consultas al MS de enrollment natural person.
- Se modifica el metodo de createAccountinPTS para recibir headers en el evento de kafka.

## [0.6.0]

- configurar nuevo endpoint para obtener numeros de cuentas por userId
- Configurar Evento kafka para actualizar db accounts con la información de crm

## [0.5.0]

- Se despliega todos los cambios pendientes en ambiente STG

## [0.4.0]

- Manejo de errores de servicio accountLimitsByAccountId

## [0.3.0]

- Se actualiza changelog|package para pasar version a stg

## [0.2.1]

- Se actualiza changelog|package para pasar version a stg

## [0.2.0]

- [OFDD20-507] Consumo de evento kafka en el topico accounts.create.account.mambu, para la creacion del deposito en PTS
- Se agregan valores de PTS al values.yaml

## [0.1.0]

- Se publico la historia de usuario: CASHINOUT-10 -> Validar si el usuario receptor se encuentra en dale! o en alguna de las entidades aval
- se agrega la variable PTS_REFRESH_TOKEN en el values de la carpeta cicd
