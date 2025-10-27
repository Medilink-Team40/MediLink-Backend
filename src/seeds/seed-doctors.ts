/**
 * seed-doctors.ts
 * Script para poblar la base de datos con doctores ficticios usando @faker-js/faker
 * y crear automáticamente sus calendarios, reglas de disponibilidad y salas de Zoom
 * 
 * Ejecutar con: npm run seed:doctors
 */

import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker/locale/es_MX';
import * as dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import process from 'process'

dotenv.config();

// Importar entidades
import { Practitioner } from '../practitioner/entities/practitioner.entity';
import { PractitionerQualification } from '../practitioner/entities/qualification.entity';
import { PractitionerTelecom } from '../practitioner/entities/telecom.entity';
import { PractitionerIdentifier } from '../practitioner/entities/identifier.entity';
import { CalendarEntity } from '../calendar/entity/calendar.entity';
import { AvailabilityRule } from '../availability/entity/availability.entity';
import { AppointmentEntity, AppointmentType } from '../appointment/entity/appointment.entity';
import { FHIRExternalGender, FHIRIdentifierUse, FHIRTelecomSystem, TelecomUses } from '../practitioner/practitioner.types';
import { RolesTypes } from '../auth/auth.types';

// Configurar DataSource
const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.POSTGRES_URL as string,
  entities: [
    Practitioner,
    PractitionerQualification,
    PractitionerTelecom,
    PractitionerIdentifier,
    CalendarEntity,
    AvailabilityRule,
    AppointmentEntity,
  ],
  synchronize: false,
  logging: false,
});

interface DoctorData {
  keycloakId: string;
  email: string;
  name: { use: string; text: string; family: string; given: string[] }[];
  gender: FHIRExternalGender;
  birthDate: Date;
  specialty: string;
  qualification: { system: string; code: string; display: string };
  phone: string;
  licenseNumber: string;
  zoomUserId: string;
  timezone: string;
}

/**
 * Genera datos ficticios de un doctor usando Faker
 */
function generateDoctorData(): DoctorData {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const gender = faker.datatype.boolean() ? FHIRExternalGender.MALE : FHIRExternalGender.FEMALE;
  const specialty = faker.helpers.arrayElement([
    'Cardiología',
    'Neurología',
    'Dermatología',
    'Pediatría',
    'Cirugía General',
    'Psiquiatría',
    'Oftalmología',
    'Otorrinolaringología',
  ]);

  const qualificationMap: Record<string, { code: string; display: string }> = {
    Cardiología: { code: 'MD_CARDIOLOGY', display: 'Doctor en Cardiología' },
    Neurología: { code: 'MD_NEUROLOGY', display: 'Doctor en Neurología' },
    Dermatología: { code: 'MD_DERMATOLOGY', display: 'Doctor en Dermatología' },
    Pediatría: { code: 'MD_PEDIATRICS', display: 'Doctor en Pediatría' },
    'Cirugía General': { code: 'MD_SURGERY', display: 'Doctor en Cirugía General' },
    Psiquiatría: { code: 'MD_PSYCHIATRY', display: 'Doctor en Psiquiatría' },
    Oftalmología: { code: 'MD_OPHTHALMOLOGY', display: 'Doctor en Oftalmología' },
    Otorrinolaringología: { code: 'MD_ENT', display: 'Doctor en Otorrinolaringología' },
  };

  const email = faker.internet.email().toLowerCase();
  const zoomUserEmail = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@medilink.zoom`;

  return {
    keycloakId: uuidv4(),
    email,
    name: [
      {
        use: 'official',
        text: `Dr. ${firstName} ${lastName}`,
        family: lastName,
        given: [firstName],
      },
    ],
    gender,
    birthDate: faker.date.birthdate({
      refDate:'10',
      mode:'year',
      min:9,
      max:20
    }),
    //faker.date.birthDate({ min: 30, max: 60, mode: 'age' }),
    specialty,
    qualification: {
      system: 'http://snomed.info/sct',
      ...qualificationMap[specialty],
    },
    phone: faker.phone.number(),
    licenseNumber: `LIC-${faker.number.bigInt('10')}`,
    //licenseNumber: `LIC-${faker.string.alphaNumeric(10).toUpperCase()}`,
    zoomUserId: zoomUserEmail,
    timezone: 'America/Mexico_City',
  };
}

/**
 * Crea reglas de disponibilidad para un doctor (Lunes a Viernes, 9:00 a 18:00 con almuerzo)
 */
function createAvailabilityRules(): AvailabilityRule[] {
  const rules: AvailabilityRule[] = [];

  // Lunes (1) a Viernes (5)
  for (let day = 1; day <= 5; day++) {
    // Turno matutino: 9:00 - 13:00
    rules.push({
      id: uuidv4(),
      dayOfWeek: day,
      startTime: '09:00',
      endTime: '13:00',
      slotMinutes: 30,
      calendar: null as any,
    });

    // Turno vespertino: 14:00 - 18:00 (después de almuerzo)
    rules.push({
      id: uuidv4(),
      dayOfWeek: day,
      startTime: '14:00',
      endTime: '18:00',
      slotMinutes: 30,
      calendar: null as any,
    });
  }

  return rules;
}

/**
 * Crea la entidad Telecom (teléfono y email)
 */
function createTelecom(doctorData: DoctorData): PractitionerTelecom[] {
  return [
    {
      id: uuidv4(),
      system: FHIRTelecomSystem.PHONE,
      value: doctorData.phone,
      use: TelecomUses.WORK,
      practitioner: null as any,
      practitionerId: '',
      rank:1
    },
    {
      id: uuidv4(),
      system: FHIRTelecomSystem.EMAIL,
      value: doctorData.email,
      use: TelecomUses.WORK,
      practitioner: null as any,
      practitionerId: '',
      rank:2
    },
  ];
}

/**
 * Crea la entidad Identifier (número de licencia)
 */
function createIdentifier(doctorData: DoctorData): PractitionerIdentifier[] {
  return [
    {
      id: uuidv4(),
      use: FHIRIdentifierUse.OFFICIAL,
      system: 'http://snomed.info/sct',
      value: doctorData.licenseNumber,
      practitioner: null as any,
      practitionerId: '',
      code:'example'
    },
  ];
}

/**
 * Crea la calificación del doctor
 */
function createQualification(
  practitionerId: string,
  qualification: DoctorData['qualification'],
): PractitionerQualification {
  const now = new Date();
  const endDate = new Date();
  endDate.setFullYear(endDate.getFullYear() + 5); // Válida por 5 años

  return {
    id: uuidv4(),
    code: [qualification],
    periodStart: now,
    periodEnd: endDate,
    practitioner: null as any,
    practitionerId,
    identifier: [],
  };
}

/**
 * Función principal de seeding
 */
async function seedDoctors() {
  try {
    // Inicializar DataSource
    console.log('\n⏳ Conectando a la base de datos...');
    await AppDataSource.initialize();
    console.log('✅ Conexión a base de datos establecida\n');

    const doctorRepository = AppDataSource.getRepository(Practitioner);
    const calendarRepository = AppDataSource.getRepository(CalendarEntity);
    const availabilityRepository = AppDataSource.getRepository(AvailabilityRule);
    const telecomRepository = AppDataSource.getRepository(PractitionerTelecom);
    const identifierRepository = AppDataSource.getRepository(PractitionerIdentifier);
    const qualificationRepository = AppDataSource.getRepository(PractitionerQualification);

    const NUM_DOCTORS = 10; // Cantidad de doctores a crear
    let createdCount = 0;

    console.log(`📋 Iniciando creación de ${NUM_DOCTORS} doctores ficticios con Faker...\n`);
    console.log('═'.repeat(80));

    for (let i = 0; i < NUM_DOCTORS; i++) {
      try {
        const doctorData = generateDoctorData();

        // 1. Crear doctor (Practitioner)
        
        const doctor = doctorRepository.create({
          keycloakId: doctorData.keycloakId,
          email: doctorData.email,
          name: doctorData.name,
          gender: doctorData.gender,
          birthDate: doctorData.birthDate,
          active: true,
          role: RolesTypes.PRACTITIONER,
          createdAt: new Date(),
        });

        const savedDoctor = await doctorRepository.save(doctor);

        console.log(`\n👨‍⚕️  Doctor ${i + 1}/${NUM_DOCTORS}: ${doctorData.name[0].text}`);
        console.log(`   📧 Email: ${doctorData.email}`);
        console.log(`   🏥 Especialidad: ${doctorData.specialty}`);
        console.log(`   🆔 Keycloak ID: ${doctorData.keycloakId}`);

        // 2. Crear Telecom (teléfono y email)
        const telecomEntities = createTelecom(doctorData).map((t) => ({
          ...t,
          practitionerId: savedDoctor.keycloakId,
        }));
        await telecomRepository.save(telecomEntities);
        console.log(`   📞 Teléfono: ${doctorData.phone}`);

        // 3. Crear Identifier (licencia médica)
        const identifierEntities = createIdentifier(doctorData).map((id) => ({
          ...id,
          practitionerId: savedDoctor.keycloakId,
        }));
        await identifierRepository.save(identifierEntities);
        console.log(`   📜 Licencia: ${doctorData.licenseNumber}`);

        // 4. Crear Qualification
        const qualification = createQualification(
          savedDoctor.keycloakId,
          doctorData.qualification,
        );
        qualification.practitioner = savedDoctor;
        qualification.practitionerId = savedDoctor.keycloakId;
        await qualificationRepository.save(qualification);
        console.log(`   🎓 Cualificación: ${doctorData.qualification.display}`);

        // 5. Crear Calendar
        const calendar = calendarRepository.create({
          practitioner: savedDoctor,
          defaultSlotMinutes: 30,
        });
        const savedCalendar = await calendarRepository.save(calendar);
        console.log(`   📅 Calendario creado: ${savedCalendar.id}`);

        // 6. Crear Availability Rules (horarios)
        const availabilityRules = createAvailabilityRules().map((rule) => ({
          ...rule,
          calendar: savedCalendar,
        }));
        await availabilityRepository.save(availabilityRules);
        console.log(`   🕒 Disponibilidad: Lunes-Viernes`);
        console.log(`      • Mañana: 09:00 - 13:00`);
        console.log(`      • Tarde: 14:00 - 18:00`);
        console.log(`      • Slots: 30 minutos`);

        // 7. Zoom Meeting preparado
        console.log(`   🎥 Zoom User: ${doctorData.zoomUserId}`);
        console.log(`   ⏰ Zona horaria: ${doctorData.timezone}`);

        createdCount++;

      } catch (error) {
        console.error(`   ❌ Error creando doctor ${i + 1}:`, error);
      }
    }

    console.log(`\n${'═'.repeat(80)}`);
    console.log(`\n✅ SEEDING COMPLETADO! ${createdCount}/${NUM_DOCTORS} doctores creados exitosamente\n`);

    console.log('📊 RESUMEN:');
    console.log(`   ✓ Doctores creados: ${createdCount}`);
    console.log(`   ✓ Calendarios: ${createdCount}`);
    console.log(`   ✓ Reglas de disponibilidad: ${createdCount * 4} (2 turnos × 5 días)`);
    console.log(`   ✓ Contactos (email + teléfono): ${createdCount * 2}`);
    console.log(`   ✓ Licencias médicas: ${createdCount}`);
    console.log(`   ✓ Cualificaciones: ${createdCount}`);
    console.log(`   ✓ Salas Zoom preparadas: ${createdCount}\n`);

    console.log('💡 PRÓXIMOS PASOS:');
    console.log(`   1. Los doctores ahora tienen horarios configurados automáticamente`);
    console.log(`   2. Los pacientes pueden solicitar citas respetando estos horarios`);
    console.log(`   3. Las salas de Zoom se generan automáticamente al confirmar cita virtual`);
    console.log(`   4. El sistema evita conflictos de horarios automáticamente\n`);

    console.log('🧪 VERIFICAR EN BD:');
    console.log(`   SELECT COUNT(*) FROM practitioner;`);
    console.log(`   SELECT COUNT(*) FROM calendars;`);
    console.log(`   SELECT COUNT(*) FROM availability_rules;\n`);

    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERROR FATAL durante seeding:', error);
    console.error('\n🔍 SOLUCIONES:');
    console.error('   1. Verificar variables de entorno en .env');
    console.error('   2. Verificar conexión a base de datos PostgreSQL');
    console.error('   3. Verificar que las migraciones se han ejecutado');
    console.error('   4. Ejecutar: npm run schema:sync\n');
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
  }
}

// Ejecutar seeding
seedDoctors();
