import { IDetails } from './dto/event-log.dto';
export interface EventLogStrategy {
  getCellPhoneOrigin(eventObject?): string;
  getCellPhoneDestiny(eventObject?): string;
  getOperators(eventObject, type?: string): Array<string>;
  getAdditionalDetail(
    eventObject?,
    idetail?: Array<IDetails>,
    type?: string,
  ): Array<IDetails>;
  doAlgorithm(baseEventLog?);
}
