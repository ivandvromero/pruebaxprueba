import { Transform } from 'class-transformer';
import { setTranformData } from '../../../utils/transform-class';

export class ProductOriginTransform {
  @Transform(({ value, key }) => setTranformData(value, key), {
    toPlainOnly: true,
  })
  Field_K7_0060: string = '';

  @Transform(({ value, key }) => setTranformData(value, key), {
    toPlainOnly: true,
  })
  Field_K7_0061: string = '';

  @Transform(({ value, key }) => setTranformData(value, key), {
    toPlainOnly: true,
  })
  Field_K7_0062: string = '';

  @Transform(({ value, key }) => setTranformData(value, key), {
    toPlainOnly: true,
  })
  Field_K7_0063: string = '';

  @Transform(({ value, key }) => setTranformData(value, key), {
    toPlainOnly: true,
  })
  Field_K7_0064: string = '';

  @Transform(({ value, key }) => setTranformData(value, key), {
    toPlainOnly: true,
  })
  Field_K7_0065: number = 0;

  @Transform(({ value, key }) => setTranformData(value, key), {
    toPlainOnly: true,
  })
  Field_K7_0066: number = 0;

  @Transform(({ value, key }) => setTranformData(value, key), {
    toPlainOnly: true,
  })
  Field_K7_0067: string = '';

  @Transform(({ value, key }) => setTranformData(value, key), {
    toPlainOnly: true,
  })
  Field_K7_0068: string = '';

  @Transform(({ value, key }) => setTranformData(value, key), {
    toPlainOnly: true,
  })
  Field_K7_0069: number = 0;

  @Transform(({ value, key }) => setTranformData(value, key), {
    toPlainOnly: true,
  })
  Field_K7_0070: string = 'CO';

  @Transform(({ value, key }) => setTranformData(value, key), {
    toPlainOnly: true,
  })
  Field_K7_0071: number = 0;
}