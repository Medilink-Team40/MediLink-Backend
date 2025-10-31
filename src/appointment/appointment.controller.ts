import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { UpdateAppointmentDto, CreateAppointmentDto, GetOccupiedAppointmentsDto } from './dtos';

@ApiTags('Appointments')
@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva cita (doctor o paciente)' })
  @ApiResponse({ status: 201, description: 'Cita creada correctamente' })
  create(@Body() dto: CreateAppointmentDto) {
    return this.appointmentService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las citas (admin)' })
  findAll() {
    return this.appointmentService.findAll();
  }

  @Get('occupied-by-doctor')
  @ApiOperation({ summary: 'Obtener citas ocupadas de un doctor en un rango de fechas' })
  @ApiQuery({ name: 'practitionerId', type: 'string', description: 'ID del doctor' })
  @ApiQuery({
    name: 'startDate',
    type: 'string',
    format: 'date-time',
    description: 'Fecha de inicio del rango (ISO 8601)',
  })
  @ApiQuery({
    name: 'endDate',
    type: 'string',
    format: 'date-time',
    description: 'Fecha de fin del rango (ISO 8601)',
  })
  @ApiResponse({ status: 200, description: 'Citas ocupadas obtenidas correctamente' })
  getOccupiedAppointmentsByDoctor(@Query() query: GetOccupiedAppointmentsDto) {
    return this.appointmentService.getOccupiedAppointmentsByDoctor(
      query.practitionerId,
      new Date(query.startDate),
      new Date(query.endDate),
    );
  }

  @Get('doctor/:doctorId')
  @ApiOperation({ summary: 'Listar todas las citas de un doctor' })
  @ApiParam({ name: 'doctorId', type: 'string' })
  findByDoctor(@Param('doctorId') doctorId: string) {
    return this.appointmentService.findByDoctor(doctorId);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Listar todas las citas de un paciente' })
  @ApiParam({ name: 'patientId', type: 'string' })
  findByPatient(@Param('patientId') patientId: string) {
    return this.appointmentService.findByPatient(patientId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ver detalles de una cita por ID' })
  @ApiParam({ name: 'id', type: 'string' })
  findOne(@Param('id') id: string) {
    return this.appointmentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una cita existente' })
  @ApiParam({ name: 'id', type: 'string' })
  update(@Param('id') id: string, @Body() dto: UpdateAppointmentDto) {
    return this.appointmentService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una cita' })
  @ApiParam({ name: 'id', type: 'string' })
  remove(@Param('id') id: string) {
    return this.appointmentService.remove(id);
  }
}
