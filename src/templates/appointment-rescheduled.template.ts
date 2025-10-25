interface AppointmentRescheduledData {
  doctor: string;
  date: string;
}

export const appointmentRescheduledTemplate = (data: AppointmentRescheduledData) => ({
  subject: 'Cita Reagendada',
  message: `Tu cita con el Dr. ${data.doctor} ha sido reagendada para el ${data.date}.`,
});
