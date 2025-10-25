import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min, Max, IsOptional } from 'class-validator';

export class CreateAvailabilityDto {
  @ApiProperty({
    description: 'Día de la semana (0=Domingo, 6=Sábado)',
    example: 1,
    minimum: 0,
    maximum: 6,
  })
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek: number;

  @ApiProperty({
    description: 'Hora de inicio (HH:mm)',
    example: '09:00',
  })
  @IsString()
  startTime: string;

  @ApiProperty({
    description: 'Hora de fin (HH:mm)',
    example: '17:30',
  })
  @IsString()
  endTime: string;

  @ApiProperty({
    description: 'Duración de cada slot en minutos (opcional)',
    example: 30,
    required: false,
  })
  @IsOptional()
  @IsInt()
  slotMinutes?: number;
}
