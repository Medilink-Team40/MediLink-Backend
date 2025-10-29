import { Module } from '@nestjs/common';
import { KeycloakModule } from '../keycloak/keycloak.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeyCloakService } from '../keycloak/services/create/create.service';
import { HttpModule } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';
import { PersonUpdaterFactory } from '../person/factory/person-updater.factory';
import { Patient } from './entities/patient.entity';
import { PatientIdentifier } from './entities/identifier.entity';
import { PatientTelecom } from './entities/telecom.entity';
import { PractitionerController } from '../practitioner/controllers/practitioner.controller';
import { PatientService } from './services/patient/patient.service';

@Module({
  imports: [
    HttpModule,
    PassportModule,
    KeycloakModule,
    TypeOrmModule.forFeature([
      Patient,
      PatientIdentifier,
      PatientTelecom,
    ]),
  ],
  controllers: [PractitionerController],
  providers: [KeyCloakService, PatientService, PersonUpdaterFactory],
  exports: [PatientService],
})
export class PatientModule {}
