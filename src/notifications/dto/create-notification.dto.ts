import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateIf,
  IsNumber, // Importar IsNumber
} from 'class-validator';
import {
  NotificationChannel,
  NotificationEventType,
} from '../notification.types';
import {
  AppointmentCreatedPayload,
  AppointmentCancelledPayload,
  AppointmentRescheduledPayload,
  DoctorUpdatedSchedulePayload,
  AppointmentReminderPayload,
  AppointmentCompletedPayload,
} from '../../templates/template.types';
import { ApiProperty } from '@nestjs/swagger';

/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

type EventPayloadMap = {
  [NotificationEventType.APPOINTMENT_CREATED]: AppointmentCreatedPayload;
  [NotificationEventType.APPOINTMENT_CANCELLED]: AppointmentCancelledPayload;
  [NotificationEventType.APPOINTMENT_RESCHEDULED]: AppointmentRescheduledPayload;
  [NotificationEventType.APPOINTMENT_COMPLETED]: AppointmentCompletedPayload;
  [NotificationEventType.DOCTOR_UPDATED_SCHEDULE]: DoctorUpdatedSchedulePayload;
  [NotificationEventType.APPOINTMENT_REMINDER]: AppointmentReminderPayload;
};

type EventPayload = EventPayloadMap[keyof EventPayloadMap];

export class CreateNotificationDto {
  @ApiProperty({
    enum: NotificationEventType,
    description: 'Tipo de evento de notificación',
  })
  @IsEnum(() => NotificationEventType, {
    message: 'The event type is not valid',
  })
  event: NotificationEventType;

  @ApiProperty({ description: 'Destinatario de la notificación' })
  @IsString()
  @IsNotEmpty({ message: 'El destinatario es requerido' })
  recipient: string;

  @ApiProperty({
    enum: NotificationChannel,
    description: 'Canal de envío de la notificación',
  })
  @IsEnum(NotificationChannel, {
    message: 'El canal debe ser email, sms o push',
  })
  channel: NotificationChannel;

  @ApiProperty({
    description: 'Carga útil (payload) del evento de notificación',
    oneOf: [
      { $ref: '#/components/schemas/AppointmentCreatedPayload' },
      { $ref: '#/components/schemas/AppointmentCancelledPayload' },
      { $ref: '#/components/schemas/AppointmentRescheduledPayload' },
      { $ref: '#/components/schemas/AppointmentCompletedPayload' },
      { $ref: '#/components/schemas/DoctorUpdatedSchedulePayload' },
      { $ref: '#/components/schemas/AppointmentReminderPayload' },
    ],
  })
  @ValidateIf(
    (o: CreateNotificationDto) =>
      o.event !== NotificationEventType.DOCTOR_UPDATED_SCHEDULE,
  )
  @IsObject()
  @IsNotEmpty({ message: 'El payload no puede estar vacío para este evento' })
  payload: EventPayload;

  @ApiProperty({
    description: 'Retraso opcional en milisegundos para programar la notificación',
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  delay?: number;
}
