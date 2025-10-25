import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CalendarService } from './calendar.service';
import {
  CreateCalendarDto,
  UpdateCalendarDto,
  CalendarDayViewDto,
  CalendarWeekViewDto,
} from './dtos';

@ApiTags('Calendar')
@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post('doctor/:doctorId/auto-create')
  @ApiOperation({
    summary: 'Crear calendario automáticamente si no existe',
    description: 'Si el doctor ya tiene calendario, retorna el existente',
  })
  @ApiResponse({ status: 201, description: 'Calendario creado o retornado' })
  @ApiParam({
    name: 'doctorId',
    type: 'string',
    description: 'Keycloak ID del doctor',
  })
  autoCreateCalendar(
    @Param('doctorId') doctorId: string,
    @Body() dto?: CreateCalendarDto,
  ) {
    return this.calendarService.createOrGetCalendar(doctorId, dto);
  }

  @Get('doctor/:doctorId')
  @ApiOperation({ summary: 'Obtener calendario del doctor' })
  @ApiParam({
    name: 'doctorId',
    type: 'string',
    description: 'Keycloak ID del doctor',
  })
  @ApiResponse({ status: 200, description: 'Calendario del doctor' })
  getCalendarByDoctor(@Param('doctorId') doctorId: string) {
    return this.calendarService.findByDoctor(doctorId);
  }

  @Patch(':calendarId')
  @ApiOperation({ summary: 'Actualizar configuración del calendario' })
  @ApiParam({ name: 'calendarId', type: 'string' })
  @ApiResponse({ status: 200, description: 'Calendario actualizado' })
  updateCalendar(
    @Param('calendarId') calendarId: string,
    @Body() dto: UpdateCalendarDto,
  ) {
    return this.calendarService.update(calendarId, dto);
  }

  @Get(':calendarId/day')
  @ApiOperation({
    summary: 'Vista del calendario por día',
    description:
      'Retorna todas las citas de un día específico compatible con FullCalendar',
  })
  @ApiParam({ name: 'calendarId', type: 'string' })
  @ApiQuery({
    name: 'date',
    type: 'string',
    description: 'Fecha en formato YYYY-MM-DD',
    example: '2025-11-01',
  })
  @ApiResponse({ status: 200, description: 'Vista del día', type: CalendarDayViewDto })
  getDayView(
    @Param('calendarId') calendarId: string,
    @Query('date') date: string,
  ): Promise<CalendarDayViewDto> {
    return this.calendarService.getDayView(calendarId, new Date(date));
  }

  @Get(':calendarId/week')
  @ApiOperation({
    summary: 'Vista del calendario por semana',
    description:
      'Retorna todas las citas de una semana compatible con FullCalendar',
  })
  @ApiParam({ name: 'calendarId', type: 'string' })
  @ApiQuery({
    name: 'weekStart',
    type: 'string',
    description: 'Lunes de la semana en formato YYYY-MM-DD',
    example: '2025-11-01',
  })
  @ApiResponse({ status: 200, description: 'Vista de la semana', type: CalendarWeekViewDto })
  getWeekView(
    @Param('calendarId') calendarId: string,
    @Query('weekStart') weekStart: string,
  ): Promise<CalendarWeekViewDto> {
    return this.calendarService.getWeekView(calendarId, new Date(weekStart));
  }
}
