# Prompt para n8n - MediLink Backend

Este prompt está diseñado para ser utilizado con un nodo de lenguaje natural en n8n, permitiéndole interactuar con la base de datos de MediLink para gestionar citas y pacientes. El objetivo es que el modelo de lenguaje comprenda la estructura de las entidades y sus relaciones para poder realizar operaciones como buscar doctores, pacientes y asignar citas.

## Entidades y sus Columnas

A continuación, se detallan las entidades principales y sus columnas relevantes, junto con sus tipos de datos y descripciones.

### Entidad: `AppointmentEntity` (Tabla: `appointments`)

Representa una cita médica.

| Columna               | Tipo de Dato                                                      | Descripción                                                             |
| :-------------------- | :---------------------------------------------------------------- | :---------------------------------------------------------------------- |
| `id`                  | `UUID`                                                            | UUID único de la cita.                                                  |
| `calendar`            | `CalendarEntity`                                                  | Relación con la entidad `CalendarEntity`.                               |
| `doctor`              | `Practitioner`                                                    | Relación con la entidad `Practitioner` (el doctor que atiende la cita). |
| `patient`             | `Patient`                                                         | Relación con la entidad `Patient` (el paciente de la cita).             |
| `patientNameSnapshot` | `string`                                                          | Nombre del paciente en el momento de la cita.                           |
| `startAt`             | `timestamptz`                                                     | Fecha y hora de inicio de la cita.                                      |
| `endAt`               | `timestamptz`                                                     | Fecha y hora de finalización de la cita.                                |
| `durationMinutes`     | `int`                                                             | Duración de la cita en minutos.                                         |
| `type`                | `enum` (`presential`, `virtual`)                                  | Tipo de cita (presencial o virtual).                                    |
| `status`              | `enum` (`open`, `confirmed`, `cancelled`, `completed`, `no_show`) | Estado actual de la cita.                                               |
| `joinUrl`             | `string` (nullable)                                               | URL para unirse a la cita virtual (si aplica).                          |
| `notes`               | `string` (nullable)                                               | Notas adicionales sobre la cita.                                        |
| `createdAt`           | `timestamptz`                                                     | Fecha y hora de creación del registro.                                  |
| `updatedAt`           | `timestamptz`                                                     | Fecha y hora de última actualización del registro.                      |

### Entidad: `Patient` (Tabla: `patient`)

Representa un paciente.

| Columna      | Tipo de Dato          | Descripción                                                    |
| :----------- | :-------------------- | :------------------------------------------------------------- |
| `keycloakId` | `UUID`                | ID de Keycloak del paciente (clave primaria).                  |
| `active`     | `boolean`             | Estado activo del paciente.                                    |
| `gender`     | `enum`                | Género del paciente (`FEMALE`, `MALE`, `OTHER`, `UNKNOWN`).    |
| `email`      | `varchar`             | Email del paciente (único).                                    |
| `role`       | `enum`                | Rol del usuario (`PATIENT`).                                   |
| `birthDate`  | `date`                | Fecha de nacimiento del paciente (YYYY-MM-DD).                 |
| `name`       | `jsonb`               | Nombres del paciente (estructura JSON con `family` y `given`). |
| `createdAt`  | `timestamptz`         | Fecha y hora de creación del registro.                         |
| `identifier` | `PatientIdentifier[]` | Relación con identificadores del paciente.                     |
| `telecom`    | `PatientTelecom[]`    | Relación con información de contacto del paciente.             |

### Entidad: `Practitioner` (Tabla: `practitioner`)

Representa un profesional de la salud (doctor).

| Columna         | Tipo de Dato                  | Descripción                                                        |
| :-------------- | :---------------------------- | :----------------------------------------------------------------- |
| `keycloakId`    | `UUID`                        | ID de Keycloak del profesional (clave primaria).                   |
| `active`        | `boolean`                     | Estado activo del profesional.                                     |
| `gender`        | `enum`                        | Género del profesional (`FEMALE`, `MALE`, `OTHER`, `UNKNOWN`).     |
| `email`         | `varchar`                     | Email del profesional (único).                                     |
| `role`          | `enum`                        | Rol del usuario (`PRACTITIONER`).                                  |
| `birthDate`     | `date`                        | Fecha de nacimiento del profesional (YYYY-MM-DD).                  |
| `name`          | `jsonb`                       | Nombres del profesional (estructura JSON con `family` y `given`).  |
| `createdAt`     | `timestamptz`                 | Fecha y hora de creación del registro.                             |
| `identifier`    | `PractitionerIdentifier[]`    | Relación con identificadores del profesional.                      |
| `telecom`       | `PractitionerTelecom[]`       | Relación con información de contacto del profesional.              |
| `calendar`      | `CalendarEntity`              | Relación OneToOne con la entidad `CalendarEntity` del profesional. |
| `qualification` | `PractitionerQualification[]` | Relación con las cualificaciones del profesional.                  |

## Capacidades del Modelo de Lenguaje (n8n)

El modelo de lenguaje debe ser capaz de:

1.  **Comprender las entidades y sus relaciones:** Entender cómo `AppointmentEntity` se relaciona con `Patient` y `Practitioner` a través de sus IDs.
2.  **Navegar por la base de datos:** Realizar consultas para buscar información en las tablas `appointments`, `patient` y `practitioner`.
3.  **Asistir al paciente:**
    - **Buscar doctores:** Permitir al paciente buscar doctores por nombre, especialidad (a través de `qualification`), o disponibilidad (a través de `calendar` y `appointments`).
    - **Ver disponibilidad de doctores:** Consultar los horarios disponibles de un doctor específico.
    - **Asignar citas:** Crear nuevas citas, especificando el doctor, paciente, fecha, hora, duración y tipo.
    - **Modificar citas:** Cambiar el estado de una cita (ej. `CONFIRMED`, `CANCELLED`).
    - **Consultar citas:** Permitir al paciente ver sus citas programadas.

## Ejemplos de Interacción (para el modelo de lenguaje)

Aquí hay algunos ejemplos de cómo el modelo de lenguaje podría interpretar y responder a las entrada del usuario:

- **Usuario:** "Quiero buscar un doctor de cardiología."
  - **Modelo:** Debería buscar en la tabla `practitioner` y sus `qualification` para encontrar doctores con la especialidad "cardiología".
- **Usuario:** "Muéstrame las citas de Jane Doe."
  - **Modelo:** Debería buscar en la tabla `patient` por el nombre "Jane Doe", obtener su `keycloakId`, y luego buscar en `appointments` donde `patient.keycloakId` coincida.
- **Usuario:** "Asigna una cita con el Dr. Smith para el 15 de noviembre a las 10 AM, duración 30 minutos, virtual."
  - **Modelo:** Debería:
    1.  Buscar el `keycloakId` del "Dr. Smith" en la tabla `practitioner`.
    2.  Buscar el `keycloakId` del paciente actual (asumiendo que el contexto del usuario lo proporciona o se puede inferir).
    3.  Verificar la disponibilidad del Dr. Smith para esa fecha y hora.
    4.  Si está disponible, crear un nuevo registro en `appointments` con los detalles proporcionados.
- **Usuario:** "Cancela mi cita del 10 de octubre."
  - **Modelo:** Debería buscar la cita del paciente actual para esa fecha y actualizar su `status` a `CANCELLED`.

## Consideraciones Adicionales

- **Contexto del Usuario:** El modelo de lenguaje debe ser consciente del contexto del usuario (ej. el `keycloakId` del paciente actual) para realizar operaciones personalizadas.
- **Validación:** Antes de crear o modificar datos, el modelo debe considerar la validación de datos (ej. verificar que las fechas y horas sean válidas, que el doctor esté disponible).
- **Manejo de Errores:** El modelo debe ser capaz de comunicar errores o ambigüedades al usuario (ej. "No se encontró ningún doctor con ese nombre", "Esa hora ya está ocupada").

