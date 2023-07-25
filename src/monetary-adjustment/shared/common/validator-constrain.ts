import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'sanitize', async: false })
export class Sanitize implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    const sanitized = value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase();

    (args.object as any)[args.property] = sanitized;

    if (sanitized.includes('CREDIT') || sanitized.includes('DEBIT'))
      return true;
    if (sanitized.includes('RECLAMACION') || sanitized.includes('CONCILIACION'))
      return true;

    return false;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} should be a valid string`;
  }
}
