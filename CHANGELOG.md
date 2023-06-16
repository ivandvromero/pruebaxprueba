## [0.7.0]

-

## [0.6.0]

- [CASHINOUT-354] Notificaciones por mensaje de texto para enviar y recibir
- [CASHINOUT-484] Ajuste a campos de Trama MQ para generación de otp para retiro por atm
- [CASHINOUT-451-805] Notificaciones por mensaje de texto para retiro & reverso CB

## [0.5.2]

- [TRANSFE-444] [TRANSFE-712] modify strategy C2C send and receive method destination product

## [0.5.1]

- [TRANSFE-1259] Se personaliza origin_account para strategia TMA
- [TRANSFE-1364] Added log event reverse for intrasolution-D2-D1
- [CASHINOUT] Se cambia codigo de banco para dale 2, se ajusta zona horaria para fechas de tx fallidas, MSG_ID to response msgId

## [0.5.0]

- [CASHINOUT-484] Trama MQ para generación de otp para retiro por atm
- [TRANSFE-1240] SMS notification for TMA cashin reverse transaction. Depends on microservice notifications-netcore-ms version [1.2.10]
- [TRANSFE-1259] Se agregan campos reference para RECEIVE_TRANSFER_CORE TMA
- [CASHINOUT] fix para tramas MQ fallidas transfiya enviar, se elimina 57 del beneficiario

## [0.4.2]

- [TRANSFE-1381] Fix intransolucion strategy from d2 to d1 trama MQ
- [TRANSFE-466] Fix cell2cell withdraw strategy sendSmsNotification function. Depends on microservice notifications-netcore-ms version [1.2.10]
- [TRANSFE-1259] Se implementa log en evelogController
- [TRANSFE-712] Generacion de trama de C2C recibir y modificacion en metodo producto destino de la estrategia C2C enviar

## [0.4.1]

- [TRANSFE-1357] Data persistence of kafka events in DynamoDB. Depends on DynamoDB connection and Monitor table creation
- [TRANSFE-1378] Bug La hora no concuerda con el formato con que se genera
- [TRANSFE-1262] trama MQ para transaccion de recibir por intrasolucion D1D2
- [TRANSFE-1259] Log transaccional CORE - TMA
- [TRANSFE-995] SMS Notification for transaction cell2cell withdraw reverse. Depends on microservice notifications-netcore-ms version [1.2.9]
- FIX Add Future Use value for field K7-0143 statusRS.code
- [TRANSFE-955] Added TMA CASHIN strategy for tramas

## [0.4.0]

- [CASHINOUT-569] trama MQ para transaccion de enviar por tranfiya
- fix, se cambia path para tomar el branchId (eventLog retiro/reverso ATM Otp)

## [0.3.0]

- [CASHINOUT-592] trama MQ para transaccion de recibir por tranfiya

## [0.2.11]

- Nuevo release => [TRANSFE-1352] Adjustment for account balance on product origin and destination, device ip, sales profile status and status RS code

## [0.2.10]

- [TRANSFE-1352] Adjustment for account balance on product origin and destination, device ip, sales profile status and status RS code

## [0.2.9]

- Adjustment for enum in product origin and destination status. Depends on CRM connection and stability

## [0.2.8]

- [TRANSFE-444] Generate trama of C2C Send. This development has a dependency on the card-nestjs-ms microservice in release [0.20.3]
- [TRANSFE-994] Cell2cell_Recibir notificación SMS al usuario cuando recibe dinero desde cuenta aval. Depende del microservicio notifications-netcore-ms en la versión [1.2.9]
- [TRANSFE-1242] Ajuste en estrategia para transacción intrasolución
- FIX [TRANSFE-977] ajuste en producto origen de la base, GMF en operadores y producto destino de la estrategia intrasolución

## [0.2.7]

- [TRANSFE-1193] Rename the transaction type INT_TRAN_DO_D2D1 to intrasolucion_dale_2_dale_1
- TRANSFE-1207 Estrategia para trama mq de transacción tipo intrasolución de dale2 a dale1
- FIX TRANSFE-1107 ajuste de datos del beneficiario en cliente origen y producto origen
- FIX TRANSFE-85 ajuste a número celular de cliente origen y destino que se obtiene en crm

## [0.2.6]

- [CASHINOUT] se toma el identificador de mambu del linkedTransactionId y se limpian campos con espacios

## [0.2.5]

- [TRANSFE-1193] Create strategy for the eventlog core of INT_TRAN_DO_D2D1

## [0.2.4]

- FIX TRANSFE-1107 ajuste en reverso de tramas mq
- TRANSFE-687 Enviar notificación SMS al usuario emisor y receptor para una transferencia intrasolución
- Mapeo de campos branchId y branchType en retiroOTP y reverso OTP
- nuevo metodo getOperators para obtener comisiones segun strategia
- Se modifico campo branch_type para la estrategia de retiro OTP

## [0.2.3]

- CASHINOUT-874 log transactional core para reverso por transfiya, limpiesa de comillas en campo message_transacton
- Ajuste estrategias Cell2Cell CashIn y CashOut

## [0.2.2]

- TRANSFE-1172 Cell2cell_Log Core transaccional para cell2cell (enviar, enviar reverso y recibir)

## [0.2.1]

- Ajuste en campo Field_K7_0111 para tomar solo 20 caracteres
- Ajuste en campo WorkPhoneNumber como opcional

## [0.2.0]

- ajuste de user Agent y sessionId
- CASHINOUT-874 log transactional core para enviar por transfiya.
- FIX TRANSFE-977 variable de estado para kafka PTS topic
- CASHINOUT-874 log transactional core para recibir por transfiya.

## [0.1.11]

- FIX TRANSFE-977 eliminar filtro para event log core base al obtener la fecha de la transacción
- FIX TRANSFE-977 status y isreverse con condicionales

## [0.1.10]

- FIX TRANSFE-85 tomar valor de links del cliente de crm
- Hacer conexión a redis y verificar si se hizo correctamente

## [0.1.9]

- FIX TRANSFE-977

## [0.1.8]

- FIX TRANSFE-977 valor de total_value con decimales

## [0.1.7]

- FIX TRANSFE-977 fecha y tipo de documento con formato esperado

## [0.1.6]

- TRANSFE-977 Evento log Core Transaccional intrasolucion

## [0.1.5]

- FIX Tomar 60 caracteres de la información del dispositivo userAgent
- FIX No validar que llegue correo de forma obligatoria en Crm cliente origen y destino
- FIX Validar tipo de enrolamiento del cliente que llega del Crm
- FIX ipAddress desde donde se realiza la transacción
- REFACTOR Establecer estrategia
- TRANSFE-1107 Reversos en Trama MQ

## [0.1.4]

- HU TRANSFE-466 Cell2cell_Enviar notificación SMS al usuario cuando realiza un envío a cuentas aval

## [0.1.3]

- Modificación Redis health check usando librería
- Modification CFO additional of orderer and beneficiary

## [0.1.2]

- add eventlog module

## [0.1.1]

- Solución momentánea para Redis health check

## [0.1.0]

- HU TRANSFE-85 Pasar_Generar trama MQ para las transacciones intrasolución

## [0.0.1]

- Base LeapX
