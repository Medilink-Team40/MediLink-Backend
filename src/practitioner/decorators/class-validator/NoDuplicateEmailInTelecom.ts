import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { PractitionerTelecomDto } from '../../../practitioner/dto/Telecom.dto';

@ValidatorConstraint({ async: false })
export class NoDuplicateEmailInTelecomConstraint implements ValidatorConstraintInterface {
  validate(telecoms: PractitionerTelecomDto[], args: ValidationArguments) {
    if (!Array.isArray(telecoms)) {
      return false;
    }
    const mainEmail = args.object['email'] as string;
    if (!mainEmail) {
      return true;
    }

    const hasDuplicate = telecoms.some((telecom) => telecom.value === mainEmail);
    return !hasDuplicate;
  }

  defaultMessage(args: ValidationArguments) {
    const emailPropertyName = 'email';
    return `Ningún registro en '${args.property}' puede tener el valor igual al campo ${emailPropertyName}. El email debe ser único.`;
  }
}

export function NoDuplicateEmailInTelecom(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: NoDuplicateEmailInTelecomConstraint,
    });
  };
}
