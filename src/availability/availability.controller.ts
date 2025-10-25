import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AvailabilityService } from './availability.service';
import { CreateAvailabilityDto, UpdateAvailabilityDto, AvailableSlotsResponseDto } from './dtos';

@ApiTags('Availability')
@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Post(':calendarId/rules')
  @ApiOperation({
    summary: 'Crear regla de disponibilidad para un calendario',
  })
  @ApiResponse({ status: 201, description: 'Regla creada correctamente' })
  @ApiParam({ name: 'calendarId', type: 'string', description: 'UUID del calendario' })
  createRule(@Param('calendarId') calendarId: string, @Body() dto: CreateAvailabilityDto) {
    return this.availabilityService.create(calendarId, dto);
  }

  @Get(':calendarId/rules')
  @ApiOperation({ summary: 'Listar todas las reglas de disponibilidad de un calendario' })
  @ApiParam({ name: 'calendarId', type: 'string' })
  @ApiResponse({ status: 200, description: 'Lista de reglas de disponibilidad' })
  findRules(@Param('calendarId') calendarId: string) {
    return this.availabilityService.findByCalendar(calendarId);
  }

  @Get('rules/:id')
  @ApiOperation({ summary: 'Obtener detalles de una regla de disponibilidad' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, description: 'Detalles de la regla' })
  findOne(@Param('id') id: string) {
    return this.availabilityService.findOne(id);
  }

  @Patch('rules/:id')
  @ApiOperation({ summary: 'Actualizar una regla de disponibilidad' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, description: 'Regla actualizada' })
  updateRule(@Param('id') id: string, @Body() dto: UpdateAvailabilityDto) {
    return this.availabilityService.update(id, dto);
  }

  @Delete('rules/:id')
  @ApiOperation({ summary: 'Eliminar una regla de disponibilidad' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, description: 'Regla eliminada' })
  removeRule(@Param('id') id: string) {
    return this.availabilityService.remove(id);
  }

  @Get(':calendarId/slots')
  @ApiOperation({ summary: 'Buscar slots disponibles en un rango de fechas' })
  @ApiParam({ name: 'calendarId', type: 'string' })
  @ApiQuery({
    name: 'fromDate',
    type: 'string',
    description: 'Fecha de inicio (YYYY-MM-DD)',
    example: '2025-11-01',
  })
  @ApiQuery({
    name: 'toDate',
    type: 'string',
    description: 'Fecha de fin (YYYY-MM-DD)',
    example: '2025-11-07',
  })
  @ApiResponse({
    status: 200,
    description: 'Slots disponibles por día',
    type: [AvailableSlotsResponseDto],
  })
  findAvailableSlots(
    @Param('calendarId') calendarId: string,
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
  ): Promise<AvailableSlotsResponseDto[]> {
    return this.availabilityService.findAvailableSlots(calendarId, new Date(fromDate), new Date(toDate));
  }
}
