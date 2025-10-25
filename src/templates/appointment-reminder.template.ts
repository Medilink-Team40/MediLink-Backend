import { AppointmentReminderPayload } from './template.types';

export const appointmentReminderTemplate = (data: AppointmentReminderPayload) => ({
  subject: 'Recordatorio de Cita Médica',
  message: `Hola, te recordamos tu cita con el Dr. ${data.doctor} el ${data.date}. ¡Te esperamos!`,
});
