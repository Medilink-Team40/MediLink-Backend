## PractitionerIdentifier

Entidad que representa **identificadores oficiales o alternativos de un profesional**.  
Ejemplos: matrícula profesional, número interno de hospital, NI, PRO, ESP.

| Campo          | Tipo / Enum                   | Descripción |
|----------------|-------------------------------|-------------|
| `id`           | `uuid`                        | Identificador interno de la tabla |
| `use`          | `FHIRIdentifierUse`           | Uso del identificador (`usual`, `official`, `temp`, `secondary`) |
| `code`         | `string`                      | Tipo de identificador (`NI`, `PRO`, `ESP`) |
| `system`       | `string`                      | URL del sistema que asigna el identificador |
| `value`        | `string`                      | Valor del identificador |
| `practitioner` | `Practitioner` (ManyToOne)   | Relación con el profesional |
| `practitionerId` | `uuid`                     | FK hacia `Practitioner` |

### Códigos

| Código | Qué representa | Sistema / Assignador | Ejemplo |
|--------|----------------|--------------------|---------|
| `NI`   | Número interno del profesional en el registro nacional | SISA / REFEPS | `"541012497922"` |
| `PRO`  | Matrícula profesional que habilita a ejercer la profesión | Colegio profesional / SISA | `"61177"` |
| `ESP`  | Especialidad certificada del profesional | Colegio profesional / autoridad sanitaria | `"8"` (Cirugía General) |

### Notas
- `NI` identifica al profesional como entidad en el sistema, **no indica profesión ni especialidad**.  
- `PRO` certifica que el profesional está habilitado para ejercer una profesión concreta (por ejemplo Medicina).  
- `ESP` indica la especialidad dentro de la profesión (por ejemplo Cirugía General o Salud Pública).  
