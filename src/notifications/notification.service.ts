import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { NotificationEntity } from './entities/notification.entity';
import { NotificationChannel, NotificationEventType } from './notification.types';
import { templates, TemplateOutput } from '../templates/templates.registry';
import {
  AppointmentCreatedPayload,
  AppointmentCancelledPayload,
  AppointmentRescheduledPayload,
  DoctorUpdatedSchedulePayload,
  AppointmentReminderPayload,
  AppointmentCompletedPayload,
  UrlPayload,
  RecipePayload,
} from '../templates/template.types';
import { TwilioService } from './twilio.service';
import { NodemailerService } from './nodemailer.service';

type EventPayloadMap = {
  [NotificationEventType.APPOINTMENT_CREATED]: AppointmentCreatedPayload;
  [NotificationEventType.APPOINTMENT_CANCELLED]: AppointmentCancelledPayload;
  [NotificationEventType.APPOINTMENT_RESCHEDULED]: AppointmentRescheduledPayload;
  [NotificationEventType.APPOINTMENT_COMPLETED]: AppointmentCompletedPayload;
  [NotificationEventType.DOCTOR_UPDATED_SCHEDULE]: DoctorUpdatedSchedulePayload;
  [NotificationEventType.APPOINTMENT_REMINDER]: AppointmentReminderPayload;
  [NotificationEventType.EXAM_RESULT_URL]: UrlPayload;
  [NotificationEventType.MEDICAL_RECIPE]: RecipePayload;
};

interface CreateNotificationPayload<T extends NotificationEventType> {
  recipient: string;
  channel: NotificationChannel;
  payload: EventPayloadMap[T]; // El payload real para la plantilla
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectRepository(NotificationEntity)
    private notificationRepo: Repository<NotificationEntity>,
    @InjectQueue('notifications')
    private notificationQueue: Queue,
    private readonly twilioService: TwilioService,
    private readonly nodemailerService: NodemailerService,
  ) {}

  async createForEvent<T extends NotificationEventType>(
    event: T,
    recipient: string,
    channel: NotificationChannel,
    data: EventPayloadMap[T], // Este 'data' es el que se pasa a la plantilla
    delay?: number, // Nuevo parámetro para el retraso
  ): Promise<NotificationEntity> {
    const templateFn = templates[event];
    if (!templateFn) {
      throw new Error(`No existe plantilla para evento: ${event}`);
    }

    const notificationContent = (templateFn as (payload: EventPayloadMap[T]) => TemplateOutput)(data); // Renombrado para claridad

    const notification = this.notificationRepo.create({
      type: event,
      recipient,
      channel,
      payload: notificationContent,
      status: 'queued',
    });

    const saved = await this.notificationRepo.save(notification);

    // Si hay un retraso, se añade a la cola con el retraso y no se intenta enviar directamente
    if (delay) {
      await this.notificationQueue.add(
        'send',
        {
          id: saved.id,
          channel,
          event,
        },
        { delay },
      );
      this.logger.log(
        `🧾 Notificación programada (${event}) para ${recipient} vía ${channel} con retraso de ${delay}ms`,
      );
      return saved;
    }

    try {
      if (channel === NotificationChannel.SMS) {
        await this.twilioService.sendSms(
          recipient,
          notificationContent.text ?? notificationContent.message, // Usar message si text no está definido
        );
      } else if (channel === NotificationChannel.EMAIL) {
        await this.nodemailerService.sendMail(
          recipient,
          notificationContent.subject,
          notificationContent.html ?? notificationContent.message, // Usar message si html no está definido
        );
      }
      await this.markAsSent(saved.id);
      this.logger.log(`Notificación enviada exitosamente para ${recipient} vía ${channel}`);
    } catch (error: unknown) {
      let errorMessage = 'An unknown error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      await this.markAsFailed(saved.id, errorMessage);
      this.logger.error(`Fallo al enviar notificación para ${recipient} vía ${channel}: ${errorMessage}`);
    }

    // Aunque se intente enviar directamente, se sigue añadiendo a la cola para reintentos o procesamiento adicional
    await this.notificationQueue.add('send', {
      id: saved.id,
      channel,
      event,
    });

    this.logger.log(`🧾 Notificación creada (${event}) para ${recipient} vía ${channel}`);
    return saved;
  }

  async markAsSent(id: string): Promise<void> {
    await this.notificationRepo.update(id, { status: 'sent' });
  }

  async markAsFailed(id: string, error: string): Promise<void> {
    await this.notificationRepo.update(id, { status: 'failed', error });
  }

  async findAll(): Promise<NotificationEntity[]> {
    return this.notificationRepo.find({ order: { createdAt: 'DESC' } });
  }

  async createNotification<T extends NotificationEventType>(
    event: T,
    data: CreateNotificationPayload<T>,
    delay?: number, // Nuevo parámetro para el retraso
  ): Promise<NotificationEntity> {
    const templateFn = templates[event];
    if (!templateFn) {
      throw new Error(`No existe plantilla para evento: ${event}`);
    }

    const notificationContent = (templateFn as (payload: EventPayloadMap[T]) => TemplateOutput)(data.payload); // El payload real para la plantilla

    const notification = this.notificationRepo.create({
      type: event,
      recipient: data.recipient,
      channel: data.channel,
      payload: notificationContent,
      status: 'queued',
    });

    await this.notificationRepo.save(notification);

    // Si hay un retraso, se añade a la cola con el retraso y no se intenta enviar directamente
    if (delay) {
      await this.notificationQueue.add(
        'send-notification',
        {
          id: notification.id,
          event,
        },
        { delay },
      );
      this.logger.log(
        `🧾 Notificación programada (${event}) para ${data.recipient} vía ${data.channel} con retraso de ${delay}ms`,
      );
      return notification;
    }

    try {
      if (data.channel === NotificationChannel.SMS) {
        await this.twilioService.sendSms(
          data.recipient,
          notificationContent.text ?? notificationContent.message, // Usar message si text no está definido
        );
      } else if (data.channel === NotificationChannel.EMAIL) {
        await this.nodemailerService.sendMail(
          data.recipient,
          notificationContent.subject,
          notificationContent.html ?? notificationContent.message, // Usar message si html no está definido
        );
      }
      await this.markAsSent(notification.id);
      this.logger.log(`Notificación enviada exitosamente para ${data.recipient} vía ${data.channel}`);
    } catch (error: unknown) {
      let errorMessage = 'An unknown error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      await this.markAsFailed(notification.id, errorMessage);
      this.logger.error(`Fallo al enviar notificación para ${data.recipient} vía ${data.channel}: ${errorMessage}`);
    }

    // Aunque se intente enviar directamente, se sigue añadiendo a la cola para reintentos o procesamiento adicional
    await this.notificationQueue.add('send-notification', {
      id: notification.id,
      event,
    });

    return notification;
  }
}
