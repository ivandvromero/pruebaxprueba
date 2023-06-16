import { event_log_mnemonic, event_log_version } from "../constants/event-log";

export interface IDetails {
    key: string;
    value: string;
}
export interface ISource {
    userAgent: string;
}
export interface IAudit {
    application: string;
    clientId: string;
    clientIdType: string;
    channel: string;
    transactionId: string;
    requestId: string;
    ipAddress: string;
    sessionId: string;
}

export class BaseEventLog {
    version: string;
    eventCode: number;
    eventMnemonic: string;
    eventName: string;
    timestamp: string;
    result:boolean;
    details: IDetails[];
    source: ISource;
    audit: IAudit;
    constructor(eventCode: number, eventName: string) {
        this.version = event_log_version;
        this.eventCode = eventCode;
        this.eventMnemonic = event_log_mnemonic;
        this.eventName = eventName;
        this.timestamp = '';
        this.result = true;
        this.details = [];
        this.source = {
            userAgent: ''
        };
        this.audit = {
            application: '',
            clientId: '',
            clientIdType: '',
            channel: '',
            transactionId: '',
            requestId: '',
            ipAddress: '',
            sessionId: '',        
        };
    }
}
