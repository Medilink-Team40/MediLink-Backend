import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString } from 'class-validator';

export class GetOccupiedAppointmentsDto {
    @ApiProperty({
        description: 'ID del doctor',
        example: 'doctor-123',
    })
    @IsString()
    practitionerId: string;

    @ApiProperty({
        description: 'Fecha de inicio del rango (ISO 8601)',
        example: '2025-11-01T00:00:00Z',
    })
    @IsDateString()
    startDate: string;

    @ApiProperty({
        description: 'Fecha de fin del rango (ISO 8601)',
        example: '2025-11-01T23:59:59Z',
    })
    @IsDateString()
    endDate: string;
}
