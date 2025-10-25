import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsDateString, IsEnum } from 'class-validator';

export class SearchAppointmentsDto {
  @ApiProperty({
    description: 'Especialidad (UUID)',
    example: 'e3c2a9c3-5f7d-42b7-a7f1-9b2e6b3a27e1',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  specialtyId?: string;

  @ApiProperty({
    description: 'ID del doctor',
    example: 'd3b2a9c3-5f7d-42b7-a7f1-9b2e6b3a27e1',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  doctorId?: string;

  @ApiProperty({
    description: 'Fecha mínima (YYYY-MM-DD)',
    example: '2025-11-01',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @ApiProperty({
    description: 'Fecha máxima (YYYY-MM-DD)',
    example: '2025-11-30',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  toDate?: string;

  @ApiProperty({
    description: 'Estado de la cita',
    enum: ['open', 'confirmed', 'cancelled', 'completed', 'no_show'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['open', 'confirmed', 'cancelled', 'completed', 'no_show'])
  status?: string;
}
