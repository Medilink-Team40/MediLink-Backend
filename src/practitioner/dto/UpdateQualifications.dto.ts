import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PractitionerQualificationDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', description: 'ID de la cualificación (opcional para creación)', required: false })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty({ example: 'MD', description: 'Código de la cualificación (e.g., MD, RN)' })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({ example: '2005-06-01', description: 'Fecha de inicio de la cualificación (YYYY-MM-DD)' })
  @IsNotEmpty()
  @IsDateString()
  periodStart: Date;

  @ApiProperty({ example: '2025-06-01', description: 'Fecha de fin de la cualificación (YYYY-MM-DD)', required: false })
  @IsOptional()
  @IsDateString()
  periodEnd?: Date;
}

