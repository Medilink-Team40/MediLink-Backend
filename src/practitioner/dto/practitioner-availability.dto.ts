import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class TimeSlotDto {
  @ApiProperty({ example: '09:00', description: 'Hora de inicio del turno' })
  @IsString()
  startTime: string;

  @ApiProperty({ example: '09:30', description: 'Hora de fin del turno' })
  @IsString()
  endTime: string;

  @ApiProperty({ example: true, description: 'Indica si el turno está disponible' })
  @IsBoolean()
  available: boolean;

  @ApiProperty({ example: 'apt-456', description: 'ID de la cita si el turno no está disponible', nullable: true })
  @IsString()
  appointmentId: string | null;
}

export class AvailabilityDayDto {
  @ApiProperty({ example: '2025-11-01', description: 'Fecha de disponibilidad' })
  @IsString()
  date: string;

  @ApiProperty({ example: 'friday', description: 'Día de la semana' })
  @IsString()
  dayOfWeek: string;

  @ApiProperty({ type: [TimeSlotDto], description: 'Lista de turnos disponibles para el día' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimeSlotDto)
  timeSlots: TimeSlotDto[];
}

export class PractitionerAvailabilityResponseDto {
  @ApiProperty({ example: 'doctor-123', description: 'ID del profesional' })
  @IsString()
  practitionerId: string;

  @ApiProperty({ type: [AvailabilityDayDto], description: 'Lista de días de disponibilidad' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AvailabilityDayDto)
  availability: AvailabilityDayDto[];
}
