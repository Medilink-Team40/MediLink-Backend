import { ApiProperty } from '@nestjs/swagger';

export class AppointmentCreatedPayload {
  @ApiProperty({ description: 'Nombre del doctor' })
  doctorName: string;

  @ApiProperty({ description: 'Fecha de la cita' })
  date: string;

  @ApiProperty({ description: 'ID de la cita' })
  appointmentId: string;
}

export class AppointmentCancelledPayload {
  @ApiProperty({ description: 'Nombre del doctor' })
  doctorName: string;

  @ApiProperty({ description: 'ID de la cita' })
  appointmentId: string;
}

export class AppointmentRescheduledPayload {
  @ApiProperty({ description: 'Nombre del doctor' })
  doctor: string;

  @ApiProperty({ description: 'Fecha de la cita' })
  date: string;
}

export class UrlPayload {
  @ApiProperty({ description: 'URL a enviar en la notificación' })
  url: string;
  @ApiProperty({ description: 'Texto descriptivo para la URL' })
  description: string;
}

export class RecipePayload {
  @ApiProperty({ description: 'Nombre del paciente' })
  patientName: string;
  @ApiProperty({ description: 'Nombre del doctor' })
  doctorName: string;
  @ApiProperty({ description: 'Detalles de la receta médica' })
  recipeDetails: string;
}

export class DoctorUpdatedSchedulePayload {
  // No toma datos, pero se define como clase para Swagger
}

export class AppointmentReminderPayload {
  @ApiProperty({ description: 'Nombre del doctor' })
  doctor: string;

  @ApiProperty({ description: 'Fecha de la cita' })
  date: string;
}

export class AppointmentCompletedPayload {
  @ApiProperty({ description: 'Nombre del doctor' })
  doctor: string;

  @ApiProperty({ description: 'Fecha de la cita' })
  date: string;
}
