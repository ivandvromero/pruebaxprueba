import { Transform } from 'class-transformer';
import { setTranformData } from '../../../utils/transform-class';

export class HeadTransform {
  @Transform(({ value, key }) => setTranformData(value, key), {
    toPlainOnly: true,
  })
  Field_BYTEI: string = 'ByteI';
  @Transform(({ value, key }) => setTranformData(value, key), {
    toPlainOnly: true,
  })
  Field_CONSTANN: string = 'N';
  @Transform(({ value, key }) => setTranformData(value, key), {
    toPlainOnly: true,
  })
  Field_VWJEFECHAD: number = 8;
  @Transform(({ value, key }) => setTranformData(value, key), {
    toPlainOnly: true,
  })
  Field_VWJEFECHAM: number = 0;
  @Transform(({ value, key }) => setTranformData(value, key), {
    toPlainOnly: true,
  })
  Field_VWJEFECHAA: number = 0;
  @Transform(({ value, key }) => setTranformData(value, key), {
    toPlainOnly: true,
  })
  Field_VWJEHORA: number = 0;
  @Transform(({ value, key }) => setTranformData(value, key), {
    toPlainOnly: true,
  })
  Field_SISTEMINUTE: number = 0;
  @Transform(({ value, key }) => setTranformData(value, key), {
    toPlainOnly: true,
  })
  Field_VWJETECOD: string = '08647';
  @Transform(({ value, key }) => setTranformData(value, key), {
    toPlainOnly: true,
  })
  Field_VWJEUSER: string = 'K7';
  @Transform(({ value, key }) => setTranformData(value, key), {
    toPlainOnly: true,
  })
  Field_90001: string = 'MFI-K7-002';
}
