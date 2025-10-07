# Módulo de Notificaciones

Este módulo es responsable de gestionar el envío de notificaciones a los usuarios a través de diferentes canales, como SMS y correo electrónico. Utiliza plantillas dinámicas para generar el contenido de las notificaciones y soporta el envío inmediato o programado (recordatorios).

## Canales de Notificación

Actualmente, el módulo soporta los siguientes canales:

- **SMS**: Utiliza el servicio de Twilio para enviar mensajes de texto.
- **EMAIL**: Utiliza el servicio de Nodemailer para enviar correos electrónicos.

## Funcionamiento

El flujo principal de notificaciones se gestiona a través del `NotificationService`.

1. **Creación de Eventos**: Las notificaciones se disparan en respuesta a eventos específicos en el sistema (ej. `APPOINTMENT_CREATED`, `APPOINTMENT_REMINDER`).
2. **Plantillas**: Para cada tipo de evento, existe una plantilla asociada que define el contenido de la notificación. Estas plantillas son dinámicas y se rellenan con datos específicos del evento.
3. **Canal de Envío**: Se especifica el canal a través del cual se debe enviar la notificación (SMS o EMAIL).
4. **Envío Inmediato o Programado (Recordatorios)**:
    - **Envío Inmediato**: La notificación se intenta enviar tan pronto como se crea.
    - **Recordatorios (Envío Programado)**: Se puede especificar un `delay` (retraso en milisegundos) para que la notificación se añada a una cola y se envíe después de ese tiempo. Esto es ideal para implementar recordatorios de citas o eventos futuros.
5. **Cola de Notificaciones**: El módulo utiliza BullMQ para gestionar una cola de notificaciones, lo que permite reintentos automáticos en caso de fallos temporales y el procesamiento asíncrono de envíos programados.
6. **Registro de Estado**: Cada notificación se registra en la base de datos con su estado (en cola, enviado, fallido).

## Modo de Uso (Ejemplo de API)

La interacción con el módulo de notificaciones se realiza principalmente a través de la API expuesta por `NotificationController`.

### `POST /notifications/event`

Permite crear una notificación para un evento específico.

**Body Example:**

```json
{
  "event": "APPOINTMENT_REMINDER",
  "recipient": "+5491112345678",
  "channel": "SMS",
  "data": {
    "patientName": "Juan Perez",
    "doctorName": "Dr. Ana Gomez",
    "appointmentDate": "2025-06-15",
    "appointmentTime": "10:00 AM"
  },
  "delay": 3600000 // Opcional: 1 hora de retraso para un recordatorio
}
```

### `POST /notifications`

Permite crear una notificación genérica.

**Body Example:**

```json
{
  "event": "APPOINTMENT_CREATED",
  "data": {
    "recipient": "juan.perez@example.com",
    "channel": "EMAIL",
    "payload": {
      "patientName": "Juan Perez",
      "doctorName": "Dr. Ana Gomez",
      "appointmentDate": "2025-06-10",
      "appointmentTime": "09:00 AM"
    }
  }
}
```

## Recordatorios

Los recordatorios se implementan utilizando el parámetro `delay` al crear una notificación. Al especificar un valor en milisegundos, la notificación se encola y se procesa después del tiempo indicado. Esto es útil para:

- Recordatorios de citas.
- Notificaciones de seguimiento.
- Cualquier comunicación que deba enviarse en un momento futuro.

## Visibilidad en Swagger

Todas las rutas y modelos de datos (`DTOs`) del módulo de notificaciones están documentados utilizando decoradores de Swagger (`@ApiTags`, `@ApiOperation`, `@ApiResponse`, `@ApiBody`, `@ApiProperty`). Esto asegura que la API de notificaciones sea completamente explorable y comprensible a través de la interfaz de Swagger UI.
