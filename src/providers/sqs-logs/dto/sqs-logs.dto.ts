import { HeaderSqsDto } from './../../../shared/models/common-header.dto';

export class SendMessageDto<T> {
  body: T | any;
  headers: HeaderSqsDto;
  data: any;
  type: string;
}
