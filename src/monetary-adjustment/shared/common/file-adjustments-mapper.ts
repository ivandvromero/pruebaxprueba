import { MassiveMonetaryAdjustmentDto } from '../../modules/monetary-adjustment/dto/massive-monetary-adjustment.dto';
import { MassiveMonetaryAdjustmentFileDto } from '../../modules/monetary-adjustment/dto/massive-monetary-adjustment-file.dto';
import { AdjustmentReason } from '../enums/adjustment-reason.enum';
import { AdjustmentState } from '../enums/adjustment-state.enum';
import { TransactionType } from '../enums/adjustment-type.enum';
import { MassiveMonetaryAdjustmentFileInterface } from '../interfaces/massive-monetary-adjustment-file.interface';
import { MonetaryAdjustmentInterface } from '../interfaces/monetary-adjustment.interface';
import { nameGenerator } from './name-generator';
import { totalSum } from './total-sum';
import { convertTransactionType } from './transaction-type-normalizer';
import { convertAdjustmentReason } from './adjustment-reason-normalizer';
import { UpdateAdjustmentRegister } from '../../repositories/activity-update/update-adjustment-register.entity';

export class FileMassiveMonetaryAdjustmentMapper
  implements MassiveMonetaryAdjustmentFileInterface
{
  adjustmentState?: AdjustmentState;
  comment?: string;
  createdAt?: Date;
  fileName: string;

  frontId: string;
  formattedName?: string;
  id?: string;
  size: number;
  totalCredit: number;
  totalDebit: number;
  totalRecords: number;
  transactionLevel?: number;
  updatedAt?: Date;
  usersEmails: string[];
  adjustments: MonetaryAdjustmentInterface[];

  constructor(
    massiveMonetaryAdjustmentFileDto: MassiveMonetaryAdjustmentFileDto,
    email: string,
    updateRegister: UpdateAdjustmentRegister,
    codeDescriptions: string[],
  ) {
    const { adjustments, fileName, frontId, size } =
      massiveMonetaryAdjustmentFileDto;
    this.adjustments = adjustments.map(
      (adjustment, index) =>
        new MassiveMonetaryAdjustmentMapper(
          adjustment,
          updateRegister,
          codeDescriptions[index],
        ),
    );
    this.fileName = fileName;
    this.frontId = frontId;
    this.size = size;
    this.totalCredit = totalSum(adjustments, TransactionType.CREDIT);
    this.totalDebit = totalSum(adjustments, TransactionType.DEBIT);
    this.totalRecords = adjustments.length;
    this.formattedName = nameGenerator();
    this.usersEmails = [email];
  }
}

class MassiveMonetaryAdjustmentMapper implements MonetaryAdjustmentInterface {
  createdAt?: Date;
  dateFile?: string;
  depositNumber: string;
  amount: number;
  adjustmentType: TransactionType;
  transactionCode: string;
  transactionDescription: string;
  fees: number;
  vat: number;
  gmf: number;
  isFromFile?: boolean;
  adjustmentReason: AdjustmentReason;
  responsible?: string;
  transactionName?: string;
  updateRegister: UpdateAdjustmentRegister;

  constructor(
    monetaryAdjustment: MassiveMonetaryAdjustmentDto,
    updateAdjustmentRegister: UpdateAdjustmentRegister,
    codeDescription: string,
  ) {
    const {
      date,
      depositNumber,
      amount,
      adjustmentType,
      transactionCode,
      fees,
      vat,
      gmf,
      adjustmentReason,
      responsible,
    } = monetaryAdjustment;
    this.dateFile = date;
    this.depositNumber = depositNumber;
    this.amount = +amount;
    this.adjustmentType = convertTransactionType(adjustmentType);
    this.transactionCode = transactionCode;
    this.transactionDescription = codeDescription;
    this.fees = +fees;
    this.vat = +vat;
    this.gmf = +gmf;
    this.isFromFile = true;
    this.adjustmentReason = convertAdjustmentReason(adjustmentReason);
    this.responsible = responsible;
    this.transactionName = `AMM - Ajuste ${
      this.adjustmentType === 'CREDIT' ? 'crédito' : 'débito'
    }`;
    this.updateRegister = updateAdjustmentRegister;
    this.createdAt = new Date();
  }
}
