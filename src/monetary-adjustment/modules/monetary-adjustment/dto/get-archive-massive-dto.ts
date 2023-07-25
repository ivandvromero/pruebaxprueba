import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';
export class GetArchiveMassiveDto {
  @IsString()
  @ApiProperty({
    example: '185as-fr43443-234223f',
    description: 'file id',
  })
  id: string;
  @IsOptional()
  @ApiProperty({
    example: 'Ajuste de credito',
    description: 'optional log record',
  })
  @IsIn(['true', 'false'])
  log?: string;
}
