# 🌱 MediLink - Script de Seeding de Doctores

## ¿Qué es esto?

Este script crea **10 doctores ficticios** automáticamente en tu base de datos usando **@faker-js/faker**. Cada doctor incluye:

- ✅ Información personal realista
- ✅ Contacto (email y teléfono)
- ✅ Licencia médica
- ✅ Calificaciones profesionales
- ✅ Calendario personalizado
- ✅ Horarios de disponibilidad (Lunes-Viernes 9-18 con almuerzo)
- ✅ Usuario de Zoom configurado automáticamente

## 📋 Requisitos Previos

1. **PostgreSQL corriendo** en tu máquina
2. **Archivo `.env` configurado** con credenciales de BD
3. **Dependencias instaladas**

## 🚀 Instalación y Ejecución

### Paso 1: Instalar Dependencias
```bash
npm install @faker-js/faker uuid
```

### Paso 2: Verificar `.env`
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_password
DB_NAME=medilink
```

### Paso 3: Ejecutar el Script

```bash
# Opción 1: Directamente
npm run seed:doctors

# Opción 2: Con ts-node
ts-node -r tsconfig-paths/register src/seeds/seed-doctors.ts
```

## ✨ Salida Esperada

```
⏳ Conectando a la base de datos...
✅ Conexión a base de datos establecida

📋 Iniciando creación de 10 doctores ficticios con Faker...

════════════════════════════════════════════════════════════════════════════════

👨‍⚕️  Doctor 1/10: Dr. Juan García
   📧 Email: juan.garcia@medilink.com
   🏥 Especialidad: Cardiología
   🆔 Keycloak ID: a1b2c3d4-e5f6-7890-abcd-ef1234567890
   📞 Teléfono: +52 (555) 123-4567
   📜 Licencia: LIC-9KJL2MN3PQ
   🎓 Cualificación: Doctor en Cardiología
   📅 Calendario creado: c1d2e3f4-5678-90ab-cdef-1234567890ab
   🕒 Disponibilidad: Lunes-Viernes
      • Mañana: 09:00 - 13:00
      • Tarde: 14:00 - 18:00
      • Slots: 30 minutos
   🎥 Zoom User: juan.garcia@medilink.zoom
   ⏰ Zona horaria: America/Mexico_City

[... 9 doctores más ...]

════════════════════════════════════════════════════════════════════════════════

✅ SEEDING COMPLETADO! 10/10 doctores creados exitosamente

📊 RESUMEN:
   ✓ Doctores creados: 10
   ✓ Calendarios: 10
   ✓ Reglas de disponibilidad: 40 (2 turnos × 5 días)
   ✓ Contactos (email + teléfono): 20
   ✓ Licencias médicas: 10
   ✓ Cualificaciones: 10
   ✓ Salas Zoom preparadas: 10

💡 PRÓXIMOS PASOS:
   1. Los doctores ahora tienen horarios configurados automáticamente
   2. Los pacientes pueden solicitar citas respetando estos horarios
   3. Las salas de Zoom se generan automáticamente al confirmar cita virtual
   4. El sistema evita conflictos de horarios automáticamente
```

## 🧪 Verificar en Base de Datos

```sql
-- Conectarse a PostgreSQL
psql -U postgres -d medilink

-- Ver doctores creados
SELECT COUNT(*) FROM practitioner;
-- Esperado: 10

-- Ver calendarios
SELECT COUNT(*) FROM calendars;
-- Esperado: 10

-- Ver reglas de disponibilidad
SELECT COUNT(*) FROM availability_rules;
-- Esperado: 40

-- Ver un doctor con detalles
SELECT 
  p.keycloak_id,
  p.email,
  p.name->0->>'text' as nombre,
  p.zoom_user_id,
  c.default_slot_minutes
FROM practitioner p
LEFT JOIN calendars c ON c.id_practitioner = p.keycloak_id
LIMIT 1;
```

## 📊 Estructura de Datos Creados

### Cada Doctor Incluye:

```
Practitioner (1)
├── PractitionerTelecom (2) [Email + Teléfono]
├── PractitionerIdentifier (1) [Licencia Médica]
├── PractitionerQualification (1) [Especialidad]
└── Calendar (1)
    └── AvailabilityRule (4) [2 turnos × 5 días]
```

## 🔧 Personalización

### Cambiar cantidad de doctores

Editar `seed-doctors.ts`:
```typescript
const NUM_DOCTORS = 20; // Cambiar de 10 a 20
```

### Cambiar especialidades

En `generateDoctorData()`:
```typescript
const specialty = faker.helpers.arrayElement([
  'Cardiología',
  'Neurología',
  // Agregar más aquí...
]);
```

### Cambiar horarios

En `createAvailabilityRules()`:
```typescript
// Turno matutino: 08:00 - 12:00 (en lugar de 9:00 - 13:00)
rules.push({
  startTime: '08:00',
  endTime: '12:00',
  // ...
});
```

## ⚠️ Troubleshooting

### Error: "Connection refused"
```
✗ Base de datos no está corriendo
→ Inicia PostgreSQL: psql -U postgres
```

### Error: "database does not exist"
```
✗ BD "medilink" no existe
→ Crear: createdb -U postgres medilink
```

### Error: "relation does not exist"
```
✗ Las migraciones no se ejecutaron
→ Ejecutar: npm run schema:sync
```

### Error: "@faker-js/faker not found"
```
✗ Dependencia no instalada
→ Instalar: npm install @faker-js/faker uuid
```

## 📚 Archivos Relacionados

- `src/seeds/seed-doctors.ts` - Script principal
- `src/practitioner/entities/practitioner.entity.ts` - Entidad Doctor
- `src/calendar/entity/calendar.entity.ts` - Entidad Calendario
- `src/availability/entity/availability.entity.ts` - Reglas de disponibilidad

## 🎯 Siguientes Pasos

Después de ejecutar el seed:

1. **Validar disponibilidad de slots:**
   ```bash
   GET /availability/doctor/{doctorId}/slots?startDate=2025-10-27&endDate=2025-10-31
   ```

2. **Solicitar una cita:**
   ```bash
   POST /appointments
   {
     "doctorId": "uuid-del-doctor",
     "patientId": "uuid-del-paciente",
     "startAt": "2025-10-27T09:00:00Z",
     "endAt": "2025-10-27T09:30:00Z",
     "type": "virtual"
   }
   ```

3. **Verificar sala Zoom automática:**
   - La respuesta debe incluir `joinUrl` con enlace a Zoom

## 📞 Soporte

Si tienes problemas:
1. Verifica las variables de entorno
2. Revisa los logs del script
3. Consulta la base de datos directamente
4. Verifica que TypeORM pueda conectarse

---

**¡Listo! Ahora tienes 10 doctores ficticios con toda su información lista para probar el sistema.**
