import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { FHIRTelecomSystem, TelecomUses } from '../practitioner.types';

export class PractitionerTelecomDto {
  @IsNotEmpty()
  @IsEnum(FHIRTelecomSystem)
  system: string;

  @IsNotEmpty()
  @IsString()
  value: string;

  @IsEnum(TelecomUses)
  use: string;

  @IsNumber()
  rank: string;
}
