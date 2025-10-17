export interface AppointmentCompletedPayload {
  doctor: string;
  date: string; // o Date si prefieres
}

export const appointmentCompletedTemplate = (data: {
  doctor: string;
  date: string;
}) => ({
  subject: 'Cita Completada',
  message: `Tu cita con el Dr. ${data.doctor} el ${data.date} ha sido completada.`,
});
