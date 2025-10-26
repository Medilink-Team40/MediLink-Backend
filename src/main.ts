import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
// import { Exceptions } from './filters/exceptions/exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:5173'], // Permitir solo el origen del frontend
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Importante para enviar cookies y encabezados de autorización
  });

  // 📘 Swagger config
  const config = new DocumentBuilder()
    .setTitle('MediLink API')
    .setDescription('La API de MediLink para la gestión de citas médicas.')
    .setVersion('1.0')
    .addTag('MediLink')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // 🧱 Middlewares globales
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  // app.useGlobalFilters(new Exceptions());
  app.useGlobalPipes(new ValidationPipe());

  const port = process.env.PORT || 3003; // Asegurarse de que el puerto sea 3003
  await app.listen(port, '0.0.0.0');

  Logger.log(`🚀 Servidor corriendo en el puerto ${port}`);
}
bootstrap().catch((err) => {
  Logger.error('Error al iniciar la aplicación:', err);
  process.exit(1);
});
