import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LogLevel, ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './logging.interceptor';
import { AllExceptionsFilter } from './all-exceptions.filter';
// import { Exceptions } from './filters/exceptions/exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   // --- Logger ---
  const logLevels: LogLevel[] = ['log', 'error', 'warn', 'debug', 'verbose'];
  app.useLogger(logLevels);
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://medi-link-frotend-mk1u.vercel.app',
      'https://medilink-backend-production-3d65.up.railway.app',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // 📘 Swagger config
  const config = new DocumentBuilder()
    .setTitle('MediLink API')
    .setDescription('La API de MediLink para la gestión de citas médicas.')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for matching up with @ApiBearerAuth()
    )
    .addTag('MediLink')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // 🧱 Middlewares globales

  // app.useGlobalFilters(new Exceptions());
  app.useGlobalPipes(new ValidationPipe());

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Servidor corriendo en el puerto ${port}`);
}
bootstrap().catch((err) => {
  console.error('Error al iniciar la aplicación:', err);
  process.exit(1);
});
