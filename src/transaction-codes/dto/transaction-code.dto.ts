import { IsNotEmpty, IsString } from 'class-validator';

export class TransactionCodeDto {
  @IsNotEmpty({
    message: 'El código es un campo obligatorio',
  })
  @IsString({
    message: 'El código debe enviarse como texto',
  })
  code: string;

  @IsNotEmpty({
    message: 'La descripción del código es un campo obligatorio',
  })
  @IsString({
    message: 'La descripción debe enviarse como texto',
  })
  description: string;

  @IsNotEmpty({
    message: 'El rol es un campo obligatorio',
  })
  @IsString({
    message: 'El role debe enviarse como texto',
  })
  role: string;
}
