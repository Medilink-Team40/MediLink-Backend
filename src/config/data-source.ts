import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.POSTGRES_URL,
  synchronize: false,
  logging: true,
  entities: ['@app/entities/**/*.ts'],
  migrations: ['@app/migrations/**/*.ts'],
  subscribers: ['@app/subscribers/**/*.ts'],
});
