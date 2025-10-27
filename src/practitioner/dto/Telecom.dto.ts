import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { FHIRTelecomSystem, TelecomUses } from '../practitioner.types';
import { ApiProperty } from '@nestjs/swagger';

export class PractitionerTelecomDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', description: 'ID del registro de telecomunicación (opcional para creación)', required: false })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty({ enum: FHIRTelecomSystem, example: FHIRTelecomSystem.PHONE, description: 'Sistema de telecomunicación (e.g., phone, email)' })
  @IsNotEmpty()
  @IsEnum(FHIRTelecomSystem)
  system: FHIRTelecomSystem;

  @ApiProperty({ example: '+1234567890', description: 'Valor de la telecomunicación (e.g., número de teléfono, dirección de email)' })
  @IsNotEmpty()
  @IsString()
  value: string;

  @ApiProperty({ enum: TelecomUses, example: TelecomUses.WORK, description: 'Uso de la telecomunicación (e.g., work, personal)' })
  @IsNotEmpty()
  @IsEnum(TelecomUses)
  use: TelecomUses;

  @ApiProperty({ example: 1, description: 'Ranking de preferencia de la telecomunicación' })
  @IsNotEmpty()
  @IsNumber()
  rank: number;
}
