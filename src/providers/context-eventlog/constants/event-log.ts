import configuration from '../../../config/service-configuration';

export const event_log_version = configuration().eventlog.event_log_version;
export const event_log_mnemonic = configuration().eventlog.event_log_mnemonic;

export const event_log_application =
  configuration().eventlog.event_log_application;
export const event_log_channel = configuration().eventlog.event_log_channel;

export const CASHIN_PSE_EVENT_LOG_MNEMONIC =
  configuration().eventlog.cashin_pse_event_log_mnemonic;
export const CASHIN_PSE_EVENT_LOG_CODE =
  configuration().eventlog.cashin_pse_event_log_code;
export const CASHIN_PSE_EVENT_LOG_NAME =
  configuration().eventlog.cashin_pse_event_log_name;
