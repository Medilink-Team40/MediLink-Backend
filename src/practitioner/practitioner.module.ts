import { Module } from '@nestjs/common';
import { PractitionerController } from './controllers/practitioner.controller';
import { KeycloakModule } from '../keycloak/keycloak.module';
import { PractitionerService } from './service/practitioner/practitioner.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Practitioner, PractitionerIdentifier, PractitionerQualification, PractitionerTelecom } from './entities';
import { KeyCloakService } from '../keycloak/services/create/create.service';
import { HttpModule } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';
import { PractitionerUpdaterFactory } from './factory/updater.factory';
import { QualificationController } from './controllers/qualification/qualification.controller';
import { QualificationService } from './service/qualification/qualification.service';
import { QualificationCode } from './entities/qualification-codes.entity';
import { CalendarModule } from '../calendar/calendar.module';

@Module({
  imports: [
    HttpModule,
    PassportModule,
    KeycloakModule,
    CalendarModule,
    TypeOrmModule.forFeature([Practitioner, PractitionerIdentifier, PractitionerQualification, PractitionerTelecom, QualificationCode]),
  ],
  controllers: [PractitionerController, QualificationController],
  providers: [KeyCloakService, PractitionerService, PractitionerUpdaterFactory, QualificationService],
  exports: [PractitionerService],
})
export class PractitionerModule { }
