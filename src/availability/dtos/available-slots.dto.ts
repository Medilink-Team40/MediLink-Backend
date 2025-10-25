import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsDateString } from 'class-validator';

export class SearchAvailableSlotsDto {
  @ApiProperty({
    description: 'UUID del doctor',
    example: 'd3b2a9c3-5f7d-42b7-a7f1-9b2e6b3a27e1',
  })
  @IsUUID()
  doctorId: string;

  @ApiProperty({
    description: 'Fecha de inicio (YYYY-MM-DD)',
    example: '2025-11-01',
  })
  @IsDateString()
  fromDate: string;

  @ApiProperty({
    description: 'Fecha de fin (YYYY-MM-DD)',
    example: '2025-11-07',
  })
  @IsDateString()
  toDate: string;
}

export class AvailableSlotDto {
  @ApiProperty({ example: '2025-11-01T09:00:00Z' })
  startTime: string;

  @ApiProperty({ example: '2025-11-01T09:30:00Z' })
  endTime: string;

  @ApiProperty({ example: true })
  isAvailable: boolean;
}

export class AvailableSlotsResponseDto {
  @ApiProperty({ example: '2025-11-01' })
  date: string;

  @ApiProperty({ type: [AvailableSlotDto] })
  slots: AvailableSlotDto[];
}
