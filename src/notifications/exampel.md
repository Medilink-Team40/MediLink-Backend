# Ejemplo de uso Appointments Service

```ts
import { NotificationService } from '@/notifications/notification.service';

@Injectable()
export class AppointmentsService {
  constructor(private readonly notificationService: NotificationService) {}

  async completeAppointment(appointmentId: string) {
    // ... lógica de negocio

    // notificar al paciente
    await this.notificationService.createForEvent(
      'appointment.completed',
      patient.email,
      'email',
      {
        appointmentId,
        doctorName: doctor.fullName,
        date: appointment.date,
      },
    );
  }
}

```

```json
{
  "id": "f9d2c5b8-9321-4c3f-903d-0e6ac21f2d3a",
  "type": "appointment.created",
  "recipient": "paciente@mail.com",
  "channel": "email",
  "payload": {
    "subject": "Nueva cita registrada",
    "message": "Tu cita con el Dr. Juan Pérez fue confirmada para el 2025-10-07 a las 10:00 AM.",
    "meta": {
      "appointmentId": "12345"
    }
  },
  "status": "queued"
}

```
