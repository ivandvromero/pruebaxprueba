import { Transform } from 'class-transformer';
import { setTranformData } from '../../../utils/transform-class';

export class ProductDestinationTransform {
  @Transform(({ value, key }) => setTranformData(value, key), {
    toPlainOnly: true,
  })
  Field_K7_0072	: string = '';
  @Transform(({ value, key }) => setTranformData(value, key), {
    toPlainOnly: true,
  })
  Field_K7_0073	: string = '';
  @Transform(({ value, key }) => setTranformData(value, key), {
    toPlainOnly: true,
  })
  Field_K7_0074	: string = '';
  @Transform(({ value, key }) => setTranformData(value, key), {
    toPlainOnly: true,
  })
  Field_K7_0075	: string = '';
  @Transform(({ value, key }) => setTranformData(value, key), {
    toPlainOnly: true,
  })
  Field_K7_0076	: string = '';
  @Transform(({ value, key }) => setTranformData(value, key), {
    toPlainOnly: true,
  })
  Field_K7_0077	: number = 0;
  @Transform(({ value, key }) => setTranformData(value, key), {
    toPlainOnly: true,
  })
  Field_K7_0078	: number = 0;
  @Transform(({ value, key }) => setTranformData(value, key), {
    toPlainOnly: true,
  })
  Field_K7_0079	: string = '';
  @Transform(({ value, key }) => setTranformData(value, key), {
    toPlainOnly: true,
  })
  Field_K7_0080	: string = '';
  @Transform(({ value, key }) => setTranformData(value, key), {
    toPlainOnly: true,
  })
  Field_K7_0081	: number = 0;
  @Transform(({ value, key }) => setTranformData(value, key), {
    toPlainOnly: true,
  })
  Field_K7_0082	: string = 'CO';
  @Transform(({ value, key }) => setTranformData(value, key), {
    toPlainOnly: true,
  })
  Field_K7_0083	: number = 0;
}