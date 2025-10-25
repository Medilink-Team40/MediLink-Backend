import {
  IsUUID,
  IsArray,
  ArrayMinSize,
  IsObject,
  ValidateNested,
  IsDateString,
  IsOptional,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class QualificationCodeDto {
  @IsNotEmpty()
  @IsObject()
  readonly system: string;

  @IsNotEmpty()
  readonly code: string;

  @IsNotEmpty()
  readonly display: string;
}

export class IdentifierTypeDto {
  @IsString()
  @IsNotEmpty({
    message: 'El código del tipo de identificador no puede estar vacío.',
  })
  readonly code: string;

  @IsString()
  @IsNotEmpty({
    message: 'La descripción del tipo de identificador no puede estar vacía.',
  })
  readonly display: string;
}

export class PractitionerQualificationDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => QualificationCodeDto)
  readonly code: QualificationCodeDto[];

  @IsDateString()
  readonly periodStart: string;

  @IsOptional()
  @IsDateString()
  readonly periodEnd?: string;
}
