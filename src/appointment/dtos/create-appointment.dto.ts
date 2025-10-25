import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsUUID, IsDateString, IsInt, IsString } from 'class-validator';
import { AppointmentType, AppointmentStatus } from '../entity/appointment.entity';

export class CreateAppointmentDto {
  @ApiProperty({ description: 'UUID del doctor', example: 'd3b2a9c3-5f7d-42b7-a7f1-9b2e6b3a27e1' })
  @IsUUID()
  doctorId: string;

  @ApiProperty({ description: 'UUID del paciente', example: 'f1a3b9d4-1234-5678-9abc-def012345678' })
  @IsUUID()
  patientId: string;

  @ApiProperty({ enum: AppointmentType, example: AppointmentType.VIRTUAL })
  @IsEnum(AppointmentType)
  type: AppointmentType;

  @ApiProperty({ example: '2025-11-01T10:00:00Z' })
  @IsDateString()
  startAt: string;

  @ApiProperty({ example: '2025-11-01T10:30:00Z' })
  @IsDateString()
  endAt: string;

  @ApiProperty({ example: 30 })
  @IsInt()
  durationMinutes: number;

  @ApiProperty({ enum: AppointmentStatus, required: false })
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @ApiProperty({ required: false, example: 'https://meet.example.com/room/123' })
  @IsOptional()
  @IsString()
  joinUrl?: string;

  @ApiProperty({ required: false, example: 'Cita de control' })
  @IsOptional()
  @IsString()
  notes?: string;
}
