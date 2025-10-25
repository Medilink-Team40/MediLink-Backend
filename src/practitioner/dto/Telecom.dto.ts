import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { FHIRTelecomSystem, TelecomUses } from '../practitioner.types';

export class PractitionerTelecomDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsNotEmpty()
  @IsEnum(FHIRTelecomSystem)
  system: string;

  @IsNotEmpty()
  @IsString()
  value: string;

  @IsEnum(TelecomUses)
  use: string;

  @IsNumber()
  rank: number;
}
