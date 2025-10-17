interface AppointmentCancelledData {
  doctorName: string;
  appointmentId: string;
}

export const appointmentCancelledTemplate = (
  data: AppointmentCancelledData,
) => ({
  subject: 'Cita cancelada',
  message: `La cita programada con el Dr. ${data.doctorName} ha sido cancelada.`,
  meta: { appointmentId: data.appointmentId },
});
