interface AppointmentCreatedData {
  doctorName: string;
  date: string;
  appointmentId: string;
}

export const appointmentCreatedTemplate = (data: AppointmentCreatedData) => ({
  subject: 'Nueva cita registrada',
  message: `Tu cita con el Dr. ${data.doctorName} fue confirmada para el ${data.date}.`,
  meta: {
    appointmentId: data.appointmentId,
  },
});
