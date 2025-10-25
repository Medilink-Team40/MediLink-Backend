import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UpdateAppointmentDto } from './dtos/update-appointment.dto';
import { CreateAppointmentDto } from './dtos/create-appointment.dto';

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

  @Get(':id')
  @ApiOperation({ summary: 'Ver detalles de una cita por ID' })
  @ApiParam({ name: 'id', type: 'string' })
  findOne(@Param('id') id: string) {
    return this.appointmentService.findOne(id);
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
