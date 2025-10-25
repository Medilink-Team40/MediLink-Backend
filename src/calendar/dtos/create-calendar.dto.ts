import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';

export class CreateCalendarDto {
  @ApiProperty({
    description: 'Duración por defecto de slot en minutos',
    example: 15,
    required: false,
  })
  @IsOptional()
  @IsInt()
  defaultSlotMinutes?: number;
}
