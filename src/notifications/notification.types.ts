/**
 * Define los canales a través de los cuales se pueden enviar notificaciones.
 */
export enum NotificationChannel {
  /** Notificaciones enviadas por correo electrónico. */
  EMAIL = 'email',
  /** Notificaciones enviadas por mensaje de texto (SMS). */
  SMS = 'sms',
  /** Notificaciones push (actualmente no implementado, pero reservado para futuras expansiones). */
  PUSH = 'push',
}

/**
 * Define los posibles estados de una notificación en el sistema.
 */
export enum NotificationStatus {
  /** La notificación ha sido creada y está esperando ser procesada. */
  QUEUED = 'queued',
  /** La notificación está siendo procesada para su envío. */
  PROCESSING = 'processing',
  /** La notificación ha sido enviada exitosamente. */
  SENT = 'sent',
  /** La notificación falló al ser enviada. */
  FAILED = 'failed',
}

/**
 * Define los diferentes tipos de eventos que pueden disparar una notificación.
 * Cada tipo de evento está asociado a una plantilla y un payload específico.
 */
export enum NotificationEventType {
  /** Se dispara cuando se crea una nueva cita. */
  APPOINTMENT_CREATED = 'appointment.created',
  /** Se dispara cuando una cita existente es cancelada. */
  APPOINTMENT_CANCELLED = 'appointment.cancelled',
  /** Se dispara cuando una cita existente es reagendada. */
  APPOINTMENT_RESCHEDULED = 'appointment.rescheduled',
  /** Se dispara cuando una cita ha sido completada. */
  APPOINTMENT_COMPLETED = 'appointment.completed',
  /** Se dispara cuando un doctor actualiza su horario. */
  DOCTOR_UPDATED_SCHEDULE = 'doctor.updatedSchedule',
  /** Se dispara para enviar un recordatorio de una cita próxima. */
  APPOINTMENT_REMINDER = 'appointment.reminder',
  /** Se dispara para enviar una URL de resultados de examen. */
  EXAM_RESULT_URL = 'exam.result.url',
  /** Se dispara para enviar una receta médica. */
  MEDICAL_RECIPE = 'medical.recipe',
}
