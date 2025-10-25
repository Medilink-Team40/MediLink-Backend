import { ApiProperty } from '@nestjs/swagger';

export class AppointmentViewDto {
  @ApiProperty({ example: 'f1a3b9d4-1234-5678-9abc-def012345678' })
  id: string;

  @ApiProperty({ example: '2025-11-01T08:00:00Z' })
  startAt: string;

  @ApiProperty({ example: '2025-11-01T08:30:00Z' })
  endAt: string;

  @ApiProperty({ example: 'Juan Pérez' })
  patientName: string;

  @ApiProperty({ enum: ['virtual', 'presential'], example: 'virtual' })
  type: string;

  @ApiProperty({ enum: ['open', 'confirmed', 'cancelled', 'completed', 'no_show'] })
  status: string;

  @ApiProperty({ example: 'https://meet.app/...', required: false })
  joinUrl?: string;
}

export class CalendarDayViewDto {
  @ApiProperty({ example: '2025-11-01' })
  date: string;

  @ApiProperty({ type: [AppointmentViewDto] })
  appointments: AppointmentViewDto[];
}

export class CalendarWeekViewDto {
  @ApiProperty({ example: '2025-11-01' })
  weekStart: string;

  @ApiProperty({ example: '2025-11-07' })
  weekEnd: string;

  @ApiProperty({ type: [CalendarDayViewDto] })
  days: CalendarDayViewDto[];
}
