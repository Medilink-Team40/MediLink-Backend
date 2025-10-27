import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { FHIRTelecomSystem, TelecomUses } from '../practitioner.types';

export class PractitionerTelecomDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsNotEmpty()
  @IsEnum(FHIRTelecomSystem)
  system: FHIRTelecomSystem;

  @IsNotEmpty()
  @IsString()
  value: string;

  @IsNotEmpty()
  @IsEnum(TelecomUses)
  use: TelecomUses;

  @IsNotEmpty()
  @IsNumber()
  rank: number;
}
