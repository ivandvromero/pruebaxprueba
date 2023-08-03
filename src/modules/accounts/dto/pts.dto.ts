import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

class Accumualators {
  @IsString()
  accumulator: string;
  @IsInt()
  weeklyQuantity: number;
  @IsInt()
  week: number;
  @IsInt()
  year: number;
  @IsInt()
  dailyQuantity: number;
  @IsInt()
  annualAmount: number;
  @IsInt()
  annualQuantity: number;
  @IsInt()
  weeklyAmountLimit: number;
  @IsInt()
  month: number;
  @IsInt()
  dailyAmountLimit: number;
  @IsInt()
  annualAmountLimit: number;
  @IsInt()
  monthAmount: number;
  @IsInt()
  monthlyAmountLimit: number;
  @IsInt()
  weekAmount: number;
  @IsInt()
  monthlyQuantity: number;
  @IsInt()
  dailyAmount: number;
  @IsInt()
  day: number;
  @IsBoolean()
  @IsOptional()
  canUpdate: boolean;
}

class HeaderRS {
  @IsString()
  msgId: string;
  @IsString()
  msgIdOrg: string;
  @IsString()
  timestamp: string;
}

class StatusRS {
  @IsString()
  code: string;
  @IsString()
  description: string;
}

class MessageRS {
  @IsString()
  accountId: string;
  @IsNumber()
  accountAvailableAmount: number;
  @IsString()
  accountStatus: string;
  accumulators: [Accumualators];
}

export class PtsResponse {
  messageRS: MessageRS;
  headerRS: HeaderRS;
  statusRS: StatusRS;
}
