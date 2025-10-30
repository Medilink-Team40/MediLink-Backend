import { IsDateString, IsOptional, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PractitionerQualificationDto {
  @ApiProperty({ example: 'keycloak-id-of-practitioner', description: 'ID de Keycloak del profesional' })
  @IsNotEmpty()
  @IsString()
  readonly practitionerId: string;

  @ApiProperty({ example: 'MD', description: 'Código de la cualificación (e.g., MD, RN)' })
  @IsNotEmpty()
  @IsString()
  readonly code: string;

  @ApiProperty({ example: '2005-06-01', description: 'Fecha de inicio del período de cualificación (YYYY-MM-DD)' })
  @IsDateString()
  readonly periodStart: Date;

  @ApiProperty({
    example: '2025-06-01',
    description: 'Fecha de fin del período de cualificación (YYYY-MM-DD)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  readonly periodEnd: Date;
}
