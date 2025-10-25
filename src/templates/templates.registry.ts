//import { NotificationEventType } from '../notifications/notification.types';
import { appointmentCreatedTemplate } from './appointment-created.template';
import { appointmentCancelledTemplate } from './appointment-cancelled.template';
import { appointmentRescheduledTemplate } from './appointment-rescheduled.template';
import { appointmentCompletedTemplate } from './appointment-completed.template';
import { examResultUrlTemplate } from './exam-result-url.template';
import { medicalRecipeTemplate } from './medical-recipe.template';
import {
  AppointmentCreatedPayload,
  AppointmentCancelledPayload,
  AppointmentRescheduledPayload,
  DoctorUpdatedSchedulePayload,
  AppointmentReminderPayload,
  AppointmentCompletedPayload,
  UrlPayload,
  RecipePayload,
} from './template.types';
import { NotificationEventType } from 'src/notifications/notification.types';

export type TemplateOutput = {
  subject: string;
  message: string;
  html?: string; // Añadido para correos electrónicos
  text?: string; // Añadido para SMS
  meta?: Record<string, any>;
};

export type TemplateFunction<T> = (data: T) => TemplateOutput;

export const templates: {
  [NotificationEventType.APPOINTMENT_CREATED]: TemplateFunction<AppointmentCreatedPayload>;
  [NotificationEventType.APPOINTMENT_CANCELLED]: TemplateFunction<AppointmentCancelledPayload>;
  [NotificationEventType.APPOINTMENT_RESCHEDULED]: TemplateFunction<AppointmentRescheduledPayload>;
  [NotificationEventType.APPOINTMENT_COMPLETED]: TemplateFunction<AppointmentCompletedPayload>;
  [NotificationEventType.DOCTOR_UPDATED_SCHEDULE]: TemplateFunction<DoctorUpdatedSchedulePayload>;
  [NotificationEventType.APPOINTMENT_REMINDER]: TemplateFunction<AppointmentReminderPayload>;
  [NotificationEventType.EXAM_RESULT_URL]: TemplateFunction<UrlPayload>;
  [NotificationEventType.MEDICAL_RECIPE]: TemplateFunction<RecipePayload>;
} = {
  [NotificationEventType.APPOINTMENT_CREATED]:
    appointmentCreatedTemplate as TemplateFunction<AppointmentCreatedPayload>,
  [NotificationEventType.APPOINTMENT_CANCELLED]:
    appointmentCancelledTemplate as TemplateFunction<AppointmentCancelledPayload>,
  [NotificationEventType.APPOINTMENT_RESCHEDULED]:
    appointmentRescheduledTemplate as TemplateFunction<AppointmentRescheduledPayload>,
  [NotificationEventType.APPOINTMENT_COMPLETED]:
    appointmentCompletedTemplate as TemplateFunction<AppointmentCompletedPayload>,
  [NotificationEventType.DOCTOR_UPDATED_SCHEDULE]: () => ({
    subject: 'Tu horario ha sido actualizado',
    message: 'Se realizaron cambios en la agenda médica.',
  }),
  [NotificationEventType.APPOINTMENT_REMINDER]: (data: AppointmentReminderPayload) => ({
    subject: 'Recordatorio de cita',
    message: `Tienes una cita con el Dr. ${data.doctor} el ${data.date}.`,
  }),
  [NotificationEventType.EXAM_RESULT_URL]: examResultUrlTemplate as TemplateFunction<UrlPayload>,
  [NotificationEventType.MEDICAL_RECIPE]: medicalRecipeTemplate as TemplateFunction<RecipePayload>,
};
