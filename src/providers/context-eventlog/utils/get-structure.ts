import {
  event_log_debitname,
  event_log_debitcode,
  event_log_creditcode,
  event_log_creditname,
} from '../../../constants/api';
import { BaseEventLog } from '../dto/event-log.dto';

export const getStructure = (typeOperator) => {
  const eventListToSQS = [];
  for (const name of typeOperator) {
    if (name === 'debit') {
      eventListToSQS.push(
        new BaseEventLog(event_log_debitcode, event_log_debitname),
      );
    }
    if (name === 'credit') {
      eventListToSQS.push(
        new BaseEventLog(event_log_creditcode, event_log_creditname),
      );
    }
  }
  return eventListToSQS;
};
