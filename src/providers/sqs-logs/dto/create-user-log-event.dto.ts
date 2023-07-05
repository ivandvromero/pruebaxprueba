import { HeaderSqsDto } from 'src/shared/dto/header.dto';

export class CreateUserLogEventDto<T> {
  body: T | any;
  headers: HeaderSqsDto;
  data: any;
  type: string;
}
