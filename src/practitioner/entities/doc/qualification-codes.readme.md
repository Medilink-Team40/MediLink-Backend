## QualificationCode

Entidad que representa los **códigos estandarizados del sistema REFEPS (FHIR-AR)** para profesiones de salud.  
Se usa como catálogo base para relacionar las calificaciones (`PractitionerQualification`) con un código oficial.

| Campo     | Tipo       | Descripción |
|------------|-------------|-------------|
| `code`     | `varchar(20)` | Código FHIR-AR único (por ejemplo `10003233`) |
| `display`  | `varchar(100)` | Descripción legible (por ejemplo `Médico`) |

### Ejemplo de registros

| code | display |
|------|----------|
| 10003233 | Médico |
| 10003260 | Odontólogo |
| 10003274 | Farmacéutico |
| 10003311 | Enfermero/a |
| 10003299 | Bioquímico/a |
| 10003320 | Kinesiólogo/a |
| 10003328 | Psicólogo/a |
| 10003337 | Nutricionista |
| 10003355 | Obstetra |
