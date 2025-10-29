import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { BullBoardConfigModule } from './bull-board/bull-board.module';
import { BullMQModule } from './bullmq/bullmq.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config/typeorm.config';
import { NotificationModule } from './notifications/notification.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PractitionerModule } from './practitioner/practitioner.module';
import { KeycloakModule } from './keycloak/keycloak.module';
import { HttpModule } from '@nestjs/axios';
import { CalendarModule } from './calendar/calendar.module';
import { AvailabilityModule } from './availability/availability.module';
import { AppointmentModule } from './appointment/appointment.module';
import { PersonModule } from './person/person.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    BullMQModule,
    BullBoardConfigModule,
    NotificationModule,
    HttpModule,
    PractitionerModule,
    KeycloakModule,
    CalendarModule,
    AvailabilityModule,
    AppointmentModule,
    PersonModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
