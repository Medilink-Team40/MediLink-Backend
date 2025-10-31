import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { QualificationCode } from '../practitioner/entities/qualification-codes.entity';

dotenv.config();

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) throw new Error('❌ DATABASE_URL no está definido en el archivo .env');

// 👇 importante: ruta absoluta que busca todas las entidades .ts o .js
const AppDataSource = new DataSource({
  type: 'postgres',
  url: dbUrl,
  synchronize: false,
  logging: true,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
});

const qualifications = [
  { code: '10003233', display: 'Médico' },
  { code: '10003260', display: 'Odontólogo' },
  { code: '10003274', display: 'Farmacéutico' },
  { code: '10003311', display: 'Enfermero/a' },
  { code: '10003299', display: 'Bioquímico/a' },
  { code: '10003320', display: 'Kinesiólogo/a' },
  { code: '10003328', display: 'Psicólogo/a' },
  { code: '10003337', display: 'Nutricionista' },
  { code: '10003355', display: 'Obstetra' },
];

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('📦 Conectado a la base de datos');

    const repo = AppDataSource.getRepository(QualificationCode);

    for (const q of qualifications) {
      const exists = await repo.findOne({ where: { code: q.code } });
      if (!exists) {
        await repo.save(repo.create(q));
        console.log(`✅ Insertado: ${q.display}`);
      } else {
        console.log(`⚠️ Ya existe: ${q.display}`);
      }
    }

    console.log('🌱 Seed completado correctamente');
  } catch (error) {
    console.error('❌ Error en el seed:', error);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

seed();
