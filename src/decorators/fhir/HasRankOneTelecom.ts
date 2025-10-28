import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { CreateTelecomDto } from '../../practitioner/dto';

@ValidatorConstraint({ async: false })
export class HasRankOneConstraint implements ValidatorConstraintInterface {
  validate(telecoms: CreateTelecomDto[], args: ValidationArguments) {

    if (!telecoms) {
      return true;
    }

    if (!Array.isArray(telecoms)) {
      return false;
    }

    if (telecoms.length === 0) {
      return true;
    }
    return telecoms.some((telecom) => telecom.rank === 1);
  }

  defaultMessage(args: ValidationArguments) {
    return `La colección '${args.property}' debe contener al menos un registro con 'rank' igual a 1.`;
  }
}

export function HasRankOne(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: HasRankOneConstraint,
    });
  };
}
