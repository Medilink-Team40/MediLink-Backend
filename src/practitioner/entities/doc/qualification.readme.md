## PractitionerQualification

Entidad que representa **calificaciones profesionales y especialidades certificadas**.  
Incluye información de validez temporal y los códigos oficiales de profesión o especialidad.

| Campo          | Tipo / Enum                   | Descripción |
|----------------|-------------------------------|-------------|
| `id`           | `uuid`                        | Identificador interno de la tabla |
| `identifier`   | `PractitionerIdentifier[]`    | Lista de identificadores relacionados a esta calificación (PRO, ESP) |
| `code`         | `QualificationCodes[]`        | Lista de códigos de profesión/especialidad certificada |
| `periodStart`  | `timestamptz`                 | Fecha de inicio de validez de la calificación |
| `periodEnd`    | `timestamptz` (nullable)     | Fecha de fin de validez (opcional) |
| `practitioner` | `Practitioner` (ManyToOne)    | Relación con el profesional |
| `practitionerId` | `uuid`                       | FK hacia `Practitioner` |
