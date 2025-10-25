// match.decorator.ts

import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { IsEqualsTo } from '../class-validator/match.constraint';

export function EqualsTo(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsEqualsTo,
    });
  };
}
