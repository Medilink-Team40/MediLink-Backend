import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { KeycloakModule } from '../keycloak/keycloak.module';
import { PersonModule } from '../person/person.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { PatientTelecom } from './entities/telecom.entity';
import { PatientIdentifier } from './entities/identifier.entity';
import { PatientController } from './controllers/patient/patient.controller';
import { PatientService } from './services/patient/patient.service';

@Module({
  imports: [
    HttpModule,
    PassportModule,
    KeycloakModule,
    PersonModule,
    TypeOrmModule.forFeature([Patient, PatientTelecom, PatientIdentifier]),
  ],
  controllers: [PatientController],
  providers: [PatientService],
  exports: [],
})
export class PatientModule {}
