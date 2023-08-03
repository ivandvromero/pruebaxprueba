import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCustomerDepositDto {
  @IsString()
  @ApiProperty()
  userId: string;

  @IsString()
  @ApiProperty()
  accountId: string;

  @IsString()
  @ApiProperty()
  enrollmentId: string;

  @IsString()
  @ApiProperty()
  customerExternalId: string;

  @IsString()
  @ApiProperty()
  customerExternalNumber: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  agreementId?: string;
}
