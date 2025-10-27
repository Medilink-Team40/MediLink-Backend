import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { FHIRIdentifierUse, PractitionerIdentifierType } from '../../practitioner.types';

export class UpdateIdentifierDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsNotEmpty()
  @IsEnum(FHIRIdentifierUse)
  use: FHIRIdentifierUse;

  @IsOptional()
  @IsEnum(PractitionerIdentifierType)
  code?: PractitionerIdentifierType;

  @IsNotEmpty()
  @IsString()
  system: string;

  @IsNotEmpty()
  @IsString()
  value: string;
}

