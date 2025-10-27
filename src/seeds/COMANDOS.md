/**
 * COMANDOS PARA EJECUTAR EL SEEDING
 * ===================================
 */

// ============================================================
// ✅ COMANDO PRINCIPAL (RECOMENDADO)
// ============================================================

// npm run seed:doctors

// Este comando:
// 1. Lee el script desde src/seeds/seed-doctors.ts
// 2. Usa ts-node para ejecutarlo
// 3. Carga variables de .env automáticamente
// 4. Crea 10 doctores ficticios en la BD


// ============================================================
// COMANDOS ALTERNATIVOS
// ============================================================

// Opción 2: ts-node directo
// ts-node -r tsconfig-paths/register src/seeds/seed-doctors.ts

// Opción 3: Si usas Windows (PowerShell)
// npm run seed:doctors

// Opción 4: Con variables de entorno personalizadas
// DB_HOST=localhost DB_PORT=5432 npm run seed:doctors


// ============================================================
// PASOS PARA EJECUTAR (Paso a Paso)
// ============================================================

/*
1. Abre Terminal/CMD en la raíz del proyecto:
   C:\proyectos\MediLink-BackendTeam40

2. Verifica que .env exista y tenga valores:
   - DB_HOST=localhost
   - DB_PORT=5432
   - DB_USERNAME=postgres
   - DB_PASSWORD=tu_password
   - DB_NAME=medilink

3. Instala dependencias (si no las tienes):
   npm install @faker-js/faker uuid

4. Ejecuta el comando:
   npm run seed:doctors

5. Espera a que termine (debería tomar ~5-10 segundos)

6. Verifica en la BD que se crearon 10 doctores:
   psql -U postgres -d medilink
   SELECT COUNT(*) FROM practitioner;
*/


// ============================================================
// SALIDA ESPERADA EN TERMINAL
// ============================================================

/*
⏳ Conectando a la base de datos...
✅ Conexión a base de datos establecida

📋 Iniciando creación de 10 doctores ficticios con Faker...

════════════════════════════════════════════════════════════════════════════════

👨‍⚕️  Doctor 1/10: Dr. Juan García
   📧 Email: juan.garcia@example.com
   🏥 Especialidad: Cardiología
   🆔 Keycloak ID: a1b2c3d4-e5f6-7890-abcd-ef1234567890
   📞 Teléfono: +52 (555) 123-4567
   📜 Licencia: LIC-ABC123XYZ
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
*/


// ============================================================
// SI HAY ERRORES
// ============================================================

/*
ERROR 1: "npm: command not found"
→ Instala Node.js desde https://nodejs.org/

ERROR 2: "ENOTFOUND localhost"
→ PostgreSQL no está corriendo
→ Inicia PostgreSQL (Windows: Services > PostgreSQL)

ERROR 3: "database does not exist"
→ Crea la BD: createdb -U postgres medilink

ERROR 4: "relation does not exist"
→ Las migraciones no se ejecutaron
→ Ejecuta: npm run schema:sync

ERROR 5: "Cannot find module @faker-js/faker"
→ Instala: npm install @faker-js/faker uuid

ERROR 6: "ECONNREFUSED 127.0.0.1:5432"
→ PostgreSQL no está en el puerto 5432
→ Verifica tu .env: DB_PORT=5432
*/


// ============================================================
// VERIFICACIÓN EN BASE DE DATOS
// ============================================================

/*
Después de ejecutar npm run seed:doctors, verifica:

1. Conéctate a la BD:
   psql -U postgres -d medilink

2. Ejecuta estas queries:

   -- Contar doctores
   SELECT COUNT(*) as total FROM practitioner;
   Esperado: 10

   -- Ver doctores creados
   SELECT 
     keycloak_id,
     email,
     name->0->>'text' as nombre,
     zoom_user_id
   FROM practitioner
   LIMIT 3;

   -- Ver calendarios
   SELECT COUNT(*) as total FROM calendars;
   Esperado: 10

   -- Ver reglas de disponibilidad
   SELECT COUNT(*) as total FROM availability_rules;
   Esperado: 40

   -- Ver horarios de un doctor
   SELECT 
     day_of_week,
     start_time,
     end_time,
     slot_minutes
   FROM availability_rules
   WHERE calendar_id = (SELECT id FROM calendars LIMIT 1)
   ORDER BY day_of_week, start_time;
*/


// ============================================================
// SCRIPT ADICIONAL: LIMPIAR Y REINTENTAR
// ============================================================

/*
Si quieres eliminar todos los doctores y empezar de nuevo:

1. En PostgreSQL, ejecuta:
   
   DELETE FROM availability_rules;
   DELETE FROM appointments;
   DELETE FROM calendars;
   DELETE FROM practitioner_qualification;
   DELETE FROM practitioner_identifier;
   DELETE FROM practitioner_telecom;
   DELETE FROM practitioner;

2. Luego ejecuta de nuevo:
   npm run seed:doctors
*/


// ============================================================
// RESUMEN FINAL
// ============================================================

/*
┌─────────────────────────────────────────────────────────────┐
│  COMANDO PARA EJECUTAR EL SEEDING:                         │
│                                                             │
│  npm run seed:doctors                                       │
│                                                             │
│  O alternativamente:                                        │
│                                                             │
│  ts-node -r tsconfig-paths/register \                       │
│  src/seeds/seed-doctors.ts                                  │
└─────────────────────────────────────────────────────────────┘

✓ Genera 10 doctores ficticios
✓ Cada uno con calendario y horarios
✓ Salas de Zoom preparadas automáticamente
✓ Listo para probar el sistema de citas

🚀 ¡Ejecuta y verás los resultados en segundos!
*/
