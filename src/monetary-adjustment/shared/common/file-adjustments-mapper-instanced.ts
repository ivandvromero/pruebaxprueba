import {
  MonetaryAdjustmentEntityOrm,
  UpdateAdjustmentRegister,
} from '../../repositories/activity-update/update-adjustment-register.entity';
import { FileMassiveMonetaryAdjustment } from '../../repositories/monetary-adjustment/monetary-adjustment.entity';
import { MassiveMonetaryAdjustmentFileDto } from '../../modules/monetary-adjustment/dto/massive-monetary-adjustment-file.dto';
import { totalSum } from './total-sum';
import { TransactionType } from '../enums/adjustment-type.enum';
import { nameGenerator } from './name-generator';
import { MassiveMonetaryAdjustmentDto } from '../../modules/monetary-adjustment/dto/massive-monetary-adjustment.dto';
import { convertTransactionType } from './transaction-type-normalizer';
import { convertAdjustmentReason } from './adjustment-reason-normalizer';

export function fileAdjustmentsMapperInstanced(
  monetaryAdjustment: MassiveMonetaryAdjustmentFileDto,
  email: string,
  updateRegisterSaved: UpdateAdjustmentRegister,
  codeDescriptions: string[],
): FileMassiveMonetaryAdjustment {
  const { adjustments, fileName, frontId, size } = monetaryAdjustment;
  const file = new FileMassiveMonetaryAdjustment();
  file.fileName = fileName;
  file.frontId = frontId;
  file.size = size;
  file.totalCredit = totalSum(adjustments, TransactionType.CREDIT);
  file.totalDebit = totalSum(adjustments, TransactionType.DEBIT);
  file.totalRecords = adjustments.length;
  file.formattedName = nameGenerator();
  file.usersEmails = [email];
  file.createdAt = new Date();
  file.adjustments = adjustments.map((adjustment, index) =>
    adjustmentsMapper(adjustment, updateRegisterSaved, codeDescriptions[index]),
  );
  return file;
}

export function adjustmentsMapper(
  monetaryAdjustment: MassiveMonetaryAdjustmentDto,
  updateRegisterSaved: UpdateAdjustmentRegister,
  codeDescription: string,
): MonetaryAdjustmentEntityOrm {
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
  const adjustment = new MonetaryAdjustmentEntityOrm();
  adjustment.dateFile = date;
  adjustment.depositNumber = depositNumber;
  adjustment.amount = +amount;
  adjustment.adjustmentType = convertTransactionType(adjustmentType);
  adjustment.transactionCode = transactionCode;
  adjustment.transactionDescription = codeDescription;
  adjustment.fees = +fees;
  adjustment.vat = +vat;
  adjustment.gmf = +gmf;
  adjustment.isFromFile = true;
  adjustment.adjustmentReason = convertAdjustmentReason(adjustmentReason);
  adjustment.responsible = responsible;
  adjustment.transactionName = `AMM - Ajuste ${
    adjustment.adjustmentType === 'CREDIT' ? 'crédito' : 'débito'
  }`;
  adjustment.updateRegister = updateRegisterSaved;
  adjustment.createdAt = new Date();
  return adjustment;
}
