import {
  IsDefined,
  IsNotEmpty,
  ValidateNested,
  IsNotEmptyObject,
} from 'class-validator';

import { RS } from './message-event-RS.dto';
import { RQ } from './message-event-RQ.dto';
import { CFO } from './message-event-CFO.dto';
import { Type } from 'class-transformer';

export class MessageEvent {
  @ValidateNested({ each: true })
  @Type(() => RQ)
  @IsDefined()
  @IsNotEmptyObject()
  RQ: RQ;

  @ValidateNested({ each: true })
  @Type(() => CFO)
  @IsDefined()
  @IsNotEmptyObject()
  CFO: CFO;

  @ValidateNested({ each: true })
  @Type(() => RS)
  @IsDefined()
  @IsNotEmptyObject()
  RS: RS;

  @IsDefined()
  @IsNotEmpty()
  MSG_ID: string;

  Offset: string;
}
