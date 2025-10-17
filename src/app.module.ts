import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PractitionerModule } from './practitioner/practitioner.module';
import { KeycloakModule } from './keycloak/keycloak.module';
import { HttpModule } from '@nestjs/axios';
import { PractitionerController } from './practitioner/controllers/practitioner.controller';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import notificationConfig from './config/notification.config';
import { BullBoardConfigModule } from './bull-board/bull-board.module';
import { BullMQModule } from './bullmq/bullmq.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config/typeorm.config';
import { NotificationModule } from './notifications/notification.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule,
    PractitionerModule,
    KeycloakModule,
  ],
  controllers: [PractitionerController],
  providers: [AppService],
      load: [configuration, notificationConfig],
    }),
    // conexión TypeORM dinámica
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    BullMQModule,
    BullBoardConfigModule,
    NotificationModule, // Importar el módulo de notificaciones
  ],
})
export class AppModule {}
