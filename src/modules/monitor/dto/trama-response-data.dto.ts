import { Type } from 'class-transformer';
import {
  Length,
  IsDefined,
  IsNotEmpty,
  ValidateNested,
  IsNotEmptyObject,
} from 'class-validator';

// Header trama
export class Header {
  @IsDefined()
  @IsNotEmpty()
  @Length(5, 5)
  Field_BYTEI: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(1, 1)
  Field_CONSTANN: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(2, 2)
  Field_VWJEFECHAD: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(2, 2)
  Field_VWJEFECHAM: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(4, 4)
  Field_VWJEFECHAA: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(2, 2)
  Field_VWJEHORA: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(2, 2)
  Field_SISTEMINUTE: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(5, 5)
  Field_VWJETECOD: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(10, 10)
  Field_VWJEUSER: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(12, 12)
  Field_90001: string;
}

// Client origin
export class ClientOrigin {
  @IsDefined()
  @IsNotEmpty()
  @Length(128, 128)
  Field_K7_0001: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(1, 1)
  Field_K7_0002: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(2, 2)
  Field_K7_0003: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(20, 20)
  Field_K7_0004: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(128, 128)
  Field_K7_0005: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(64, 64)
  Field_K7_0006: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(16, 16)
  Field_K7_0007: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(35, 35)
  Field_K7_0008: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(8, 8)
  Field_K7_0009: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(8, 8)
  Field_K7_0010: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(8, 8)
  Field_K7_0011: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(2, 2)
  Field_K7_0012: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(2, 2)
  Field_K7_0013: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(3, 3)
  Field_K7_0014: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(5, 5)
  Field_K7_0015: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(2, 2)
  Field_K7_0016: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(4, 4)
  Field_K7_0017: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(1, 1)
  Field_K7_0018: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(8, 8)
  Field_K7_0019: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(8, 8)
  Field_K7_0020: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(17, 17)
  Field_K7_0021: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(17, 17)
  Field_K7_0022: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(17, 17)
  Field_K7_0023: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(17, 17)
  Field_K7_0024: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(4, 4)
  Field_K7_0025: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(5, 5)
  Field_K7_0026: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(1, 1)
  Field_K7_0027: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(1, 1)
  Field_K7_0028: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(2, 2)
  Field_K7_0029: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(1, 1)
  Field_K7_0030: string;
}

// Client destination
export class ClientDestination {
  @IsDefined()
  @IsNotEmpty()
  @Length(60, 60)
  Field_K7_0031: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(2, 2)
  Field_K7_0032: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(20, 20)
  Field_K7_0033: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(128, 128)
  Field_K7_0034: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(64, 64)
  Field_K7_0035: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(16, 16)
  Field_K7_0036: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(35, 35)
  Field_K7_0037: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(8, 8)
  Field_K7_0038: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(8, 8)
  Field_K7_0039: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(8, 8)
  Field_K7_0040: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(2, 2)
  Field_K7_0041: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(2, 2)
  Field_K7_0042: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(3, 3)
  Field_K7_0043: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(5, 5)
  Field_K7_0044: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(2, 2)
  Field_K7_0045: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(4, 4)
  Field_K7_0046: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(1, 1)
  Field_K7_0047: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(8, 8)
  Field_K7_0048: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(8, 8)
  Field_K7_0049: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(17, 17)
  Field_K7_0050: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(17, 17)
  Field_K7_0051: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(17, 17)
  Field_K7_0052: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(17, 17)
  Field_K7_0053: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(4, 4)
  Field_K7_0054: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(5, 5)
  Field_K7_0055: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(1, 1)
  Field_K7_0056: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(1, 1)
  Field_K7_0057: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(2, 2)
  Field_K7_0058: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(1, 1)
  Field_K7_0059: string;
}

// Product origin
export class ProductOrigin {
  @IsDefined()
  @IsNotEmpty()
  @Length(3, 3)
  Field_K7_0060: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(3, 3)
  Field_K7_0061: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(2, 2)
  Field_K7_0062: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(6, 6)
  Field_K7_0063: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(22, 22)
  Field_K7_0064: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(8, 8)
  Field_K7_0065: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(17, 17)
  Field_K7_0066: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(2, 2)
  Field_K7_0067: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(4, 4)
  Field_K7_0068: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(8, 8)
  Field_K7_0069: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(3, 3)
  Field_K7_0070: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(8, 8)
  Field_K7_0071: string;
}

// Product Destination
export class ProductDestination {
  @IsDefined()
  @IsNotEmpty()
  @Length(3, 3)
  Field_K7_0072: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(3, 3)
  Field_K7_0073: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(2, 2)
  Field_K7_0074: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(6, 6)
  Field_K7_0075: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(22, 22)
  Field_K7_0076: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(8, 8)
  Field_K7_0077: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(17, 17)
  Field_K7_0078: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(2, 2)
  Field_K7_0079: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(4, 4)
  Field_K7_0080: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(8, 8)
  Field_K7_0081: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(3, 3)
  Field_K7_0082: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(8, 8)
  Field_K7_0083: string;
}
// Transaction
export class Transaction {
  @IsDefined()
  @IsNotEmpty()
  @Length(20, 20)
  Field_K7_0084: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(15, 15)
  Field_K7_0085: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(10, 10)
  Field_K7_0086: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(8, 8)
  Field_K7_0087: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(8, 8)
  Field_K7_0088: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(6, 6)
  Field_K7_0089: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(10, 10)
  Field_K7_0090: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(15, 15)
  Field_K7_0091: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(2, 2)
  Field_K7_0092: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(3, 3)
  Field_K7_0093: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(17, 17)
  Field_K7_0094: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(3, 3)
  Field_K7_0095: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(17, 17)
  Field_K7_0096: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(17, 17)
  Field_K7_0097: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(2, 2)
  Field_K7_0098: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(1, 1)
  Field_K7_0099: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(6, 6)
  Field_K7_0100: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(10, 10)
  Field_K7_0101: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(1, 1)
  Field_K7_0102: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(3, 3)
  Field_K7_0103: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(20, 20)
  Field_K7_0104: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(1, 1)
  Field_K7_0105: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(2, 2)
  Field_K7_0106: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(4, 4)
  Field_K7_0107: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(4, 4)
  Field_K7_0108: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(4, 4)
  Field_K7_0109: string;
}

// Future use
export class FutureUse {
  @IsDefined()
  @IsNotEmpty()
  @Length(30, 30)
  Field_K7_0137: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(17, 17)
  Field_K7_0138: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(30, 30)
  Field_K7_0139: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(20, 20)
  Field_K7_0140: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(50, 50)
  Field_K7_0141: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(30, 30)
  Field_K7_0142: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(10, 10)
  Field_K7_0143: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(10, 10)
  Field_K7_0144: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(50, 50)
  Field_K7_0145: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(17, 17)
  Field_K7_0146: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(5, 5)
  Field_K7_0147: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(10, 10)
  Field_K7_0148: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(17, 17)
  Field_K7_0149: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(1, 1)
  Field_K7_0150: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(128, 128)
  Field_K7_0151: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(5, 5)
  Field_K7_0152: string;
}

export class TramaResponseData {
  @ValidateNested({ each: true })
  @Type(() => Header)
  @IsDefined()
  @IsNotEmptyObject()
  head: Header;

  @ValidateNested({ each: true })
  @Type(() => ClientOrigin)
  @IsDefined()
  @IsNotEmptyObject()
  clientOrigin: ClientOrigin;

  @ValidateNested({ each: true })
  @Type(() => ClientDestination)
  @IsDefined()
  @IsNotEmptyObject()
  clientDestination: ClientDestination;

  @ValidateNested({ each: true })
  @Type(() => ProductOrigin)
  @IsDefined()
  @IsNotEmptyObject()
  productOrigin: ProductOrigin;

  @ValidateNested({ each: true })
  @Type(() => ProductDestination)
  @IsDefined()
  @IsNotEmptyObject()
  producDestination: ProductDestination;

  @ValidateNested({ each: true })
  @Type(() => Transaction)
  @IsDefined()
  @IsNotEmptyObject()
  transaction: Transaction;

  @ValidateNested({ each: true })
  @Type(() => FutureUse)
  @IsDefined()
  @IsNotEmptyObject()
  futureUse: FutureUse;
}
