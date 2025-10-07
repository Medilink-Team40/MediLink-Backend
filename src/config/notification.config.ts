import { registerAs } from '@nestjs/config';

export default registerAs('notification', () => ({
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER,
  },
  nodemailer: {
    host: process.env.MAILER_HOST as string,
    port: parseInt(process.env.MAILER_PORT as string, 10) || 587, // Asumiendo un puerto por defecto si no se especifica
    secure: process.env.MAILER_SECURE === 'true', // Asumiendo secure por defecto si no se especifica
    auth: {
      user: process.env.MAILER_EMAIL as string,
      pass: process.env.MAILER_SECRET_KEY,
    },
    service: process.env.MAILER_SERVICE as string, // Agregamos el servicio si es necesario
  },
}));
