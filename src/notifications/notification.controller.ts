import { Controller, Post, Body, Get } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationEntity } from './entities/notification.entitie';
import { NotificationEventType } from './notification.types';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiExtraModels,
} from '@nestjs/swagger'; // Importar ApiExtraModels
import {
  DoctorUpdatedSchedulePayload,
  AppointmentCreatedPayload,
  AppointmentRescheduledPayload,
  AppointmentCancelledPayload, // Importar
  AppointmentCompletedPayload, // Importar
  AppointmentReminderPayload, // Importar
  UrlPayload, // Importar
  RecipePayload, // Importar
} from '../templates/template.types';

// Registrar los modelos extra para Swagger
@ApiExtraModels(
  AppointmentCreatedPayload,
  AppointmentCancelledPayload,
  AppointmentRescheduledPayload,
  AppointmentCompletedPayload,
  DoctorUpdatedSchedulePayload,
  AppointmentReminderPayload,
  UrlPayload,
  RecipePayload,
)
@ApiTags('notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly service: NotificationService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva notificación' })
  @ApiResponse({
    status: 201,
    description: 'La notificación ha sido creada exitosamente.',
    type: NotificationEntity,
  })
  async create(
    @Body() body: CreateNotificationDto,
  ): Promise<NotificationEntity> {
    const notification = await this.service.createNotification(
      body.event,
      {
        recipient: body.recipient,
        channel: body.channel,
        payload:
          body.event === NotificationEventType.DOCTOR_UPDATED_SCHEDULE
            ? new DoctorUpdatedSchedulePayload()
            : body.payload,
      },
      body.delay, // Usar el delay del DTO
    );

    // Si el delay ya fue especificado en el DTO, no programar un recordatorio adicional aquí
    if (body.delay) {
      return notification;
    }

    // Programar recordatorio si es una cita creada o reagendada y no hay delay predefinido
    if (
      (body.event === NotificationEventType.APPOINTMENT_CREATED ||
        body.event === NotificationEventType.APPOINTMENT_RESCHEDULED) &&
      !body.delay
    ) {
      const appointmentPayload = body.payload as
        | AppointmentCreatedPayload
        | AppointmentRescheduledPayload;
      const appointmentDate = new Date(appointmentPayload.date);
      const reminderTime = appointmentDate.getTime() - 24 * 60 * 60 * 1000; // 24 horas antes en milisegundos
      const calculatedDelay = reminderTime - Date.now();

      if (calculatedDelay > 0) {
        await this.service.createNotification(
          NotificationEventType.APPOINTMENT_REMINDER,
          {
            recipient: body.recipient,
            channel: body.channel, // Usar el mismo canal que la notificación original
            payload: {
              doctor:
                (appointmentPayload as AppointmentCreatedPayload).doctorName ||
                (appointmentPayload as AppointmentRescheduledPayload).doctor,
              date: appointmentPayload.date,
            },
          },
          calculatedDelay,
        );
      }
    }

    return notification;
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las notificaciones' })
  @ApiResponse({
    status: 200,
    description: 'Lista de todas las notificaciones.',
    type: [NotificationEntity],
  })
  async findAll() {
    return this.service.findAll();
  }
}
