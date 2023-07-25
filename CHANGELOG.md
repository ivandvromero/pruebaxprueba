
## [0.8.0]

-
## [0.7.4]

- [PanelAdmin-387] Se corrige el apuntado de la api hacia PTS para la consulta de transacciones
## [0.7.3]

- [PanelAdmin-1089] Se corrige bug donde en no se muestran los errores de PTS

## [0.7.2]

- [PanelAdmin-1084] Se corrige bug donde en cierto escenario la cache permitia asignar ajustes al rol incorrecto.
- [PanelAdmin-1077] Se corrige mensaje de respuesta cuando el servicio de PTS no está disponible

## [0.7.1]

- [PanelAdmin-1068] Se corrige bug donde el limite de caracteres era 100, se actualiza a 300 para rechazar ajustes.
- [PanelAdmin-HotFix] Se corrige error cuando no existe el rol en base de datos devolvía error.

## [0.7.0]
- [PanelAdmin-387] Se corrige bug de campos inexistentes y criterio de busqueda erroneo en PTS
- [PanelAdmin-706] Tiempo de inactividad según rol, DEPENDENCIAS: correr migraciones: AddSessionTimeColumnRoleTable1688654603330, AddUniqueConstrainToRoleNameRoleTable1688655199264 y AddUniqueConstrainToCodeInCodesTable1688656336726.
- [PanelAdmin-435] PEPS Rechazo de Enrolamiento USUARIO VERIFICADOR, DEPENDENCIAS:Correr migraciones HistoricalPeps1687810382203 y NewFieldsAsPhoneAndEmailToHistoricalPeps1688580236941
- [PanelAdmin-424] PEPS Aprobación de Enrolamiento USUARIO VERIFICADOR, DEPENDENCIAS: Correr migraciones HistoricalPeps1687810382203 y NewFieldsAsPhoneAndEmailToHistoricalPeps1688580236941

## [0.6.0]

- [PanelAdmin-905] Se corrige bug para permitir verificar multiples ajustes individuales y masivos
- [PanelAdmin-435] PEPS Rechazo de Enrolamiento USUARIO VERIFICADOR, DEPENDENCIAS:Correr migraciones HistoricalPeps1687810382203 y NewFieldsAsPhoneAndEmailToHistoricalPeps1688580236941
- [PanelAdmin-424] PEPS Aprobación de Enrolamiento USUARIO VERIFICADOR, DEPENDENCIAS: Correr migraciones HistoricalPeps1687810382203 y NewFieldsAsPhoneAndEmailToHistoricalPeps1688580236941
- [PanelAdmin-522] Creación modulo de notificaciones, notificaciones entre roles de ajustes masivos, creado historico de ajustes individuales. Dpendencias: correr migraciones: 1685999221761-CreateNotificationsTable.
- [PanelAdmin-904] Al reprocesar un ajuste masivo si el proveedor no esta disponible se envia error con el siguiente mensaje: "Ocurrió un error, reintente mas tarde"
- [PanelAdmin-928] Se mapean los mensajes Numero de deposito no existe, y se normalizan los mensajes.
- [PanelAdmin-881] Ultimas actividades del mes se discriminan según rol.
- [PAP-46] Se valida tiempo de expiración token PTS.

## [0.5.1]

- Se implementa servicio para guardar el token de PTS en caché

## [0.5.0]

- Se agrega codigo nuevo, se adiciona endpoint para eliminar tablas de codigos.

## [0.4.0]

- [PanelAdmin-882] Agregado error de PTS cuando el servicio está caido para probar el reprocesar.
- [PanelAdmin-880] Actualización del orden de ajustes, de mas viejo a mas nuevo.
- [PanelAdmin-663] Revision funcional ajustes monetarios, balanceador de cargas, DEPENDENCIAS: correr migraciones: 1684939303823-aflAdjustmentNewColumn, 1685452913098-aflAdjustmentRegisterNewColumnn y 1685461996055-aflFileAdjustmentsNewColumn, adicionar variables de entorno para redis y conexion M2M con auth0.
- [PanelAdmin-830] Integración del campo tipo de código de transacción (CREDITO / DEBITO), DEPENDENCIAS: Correr migraciones AddTypeFieldToTransactionCodesEntity1686157455767 y AddActiveFieldsToTransactionCodesEntity1686157152058.
- [PanelAdmin-865] Refactorización datos iniciales códigos de transaccion, DEPENDENCIAS: Ejecución del seeder códigos de tx.

## [0.3.6]

- [PanelAdmin-781] Se restaura estado de ok con errores en ajustes masivos.
- [PanelAdmin-784] se corrige el tipo de transaccion con solo la inicial en mayúscula

## [0.3.5]

- [PanelAdmin-750] Se enmascaran las tarjetas con el nuevo formato.

## [0.3.4]

- [PanelAdmin-748] Se quitan guiones al piso de la propiedad clientStateMotiveChange en persona natural.

## [0.3.3]

- [PanelAdmin-705] Razón de cambio de estado según motivo, formateo número celular
- [PanelAdmin-720] Número de tarjeta cambio de referencia desde objeto de crm.
- [PanelAdmin-741] Archivo reportes ahora tiene estados traducidos y fechas con mes dia año, actualizados permisos.

## [0.3.2]

- [PanelAdmin-704] Ajuste para la obtención de la IP remota

## [0.3.1]

- [PanelAdmin-646] Descripción de codigos agregados a ajustes masivos.
- [PanelAdmin-660] Solución en la restricción de repuesta del estado según rol

## [0.3.0]

- [PanelAdmin-505] Creación DB para roles y códigos de transacción.

## [0.2.1]

- [PanelAdmin-646] Nuevo estado ajustes masivos, actualización de flujo.

## [0.2.0]

- [PanelAdmin-493] Reporte de ajustes individuales y masivos.

## [0.1.0]

- [PanelAdmin-31] Creación de Scaffold Auth, Clients, Monetary Adjustments.
- [PanelAdmin-124] Creación de ajustes monetarios.
- [PanelAdmin-117] Actualización de ajustes monetarios.
- [PanelAdmin-158] Consultar ajustes monetarios.
- [PanelAdmin-108] Consultar clientes.
- [PanelAdmin-219] Ajustes masivos rol Capturador
- [PanelAdmin-229] Ajustes masivos rol Verificador
- [PanelAdmin-230] Ajustes masivos rol Aprobador
