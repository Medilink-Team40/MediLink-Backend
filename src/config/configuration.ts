import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';

try {
  dotenv.config();
  Logger.log('.env file loaded successfully');
} catch (error) {
  Logger.error('Error loading .env file:', error);
}

export default () => ({
  port: parseInt(process.env.PORT as string, 10),
  nodeEnv: process.env.NODE_ENV as string,

  database: {
    url: process.env.POSTGRES_URL as string,
  },

  redis: {
    host: process.env.REDIS_HOST as string,
    port: parseInt(process.env.REDIS_PORT as string, 10) || 6379, // Valor predeterminado si no está definido o es NaN
    password: process.env.REDIS_PASSWORD as string,
  },
});

// Log de la configuración cargada para depuración
// Se accede directamente a process.env para evitar problemas de referencia circular
Logger.log(
  `Configuración de Redis cargada: Host=${process.env.REDIS_HOST}, Port=${parseInt(process.env.REDIS_PORT as string, 10) || 6379}, Password=${process.env.REDIS_PASSWORD ? '******' : 'N/A'}`,
);
Logger.log(`Configuración de Base de Datos cargada: URL=${process.env.POSTGRES_URL}`);
