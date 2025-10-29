import { Module } from '@nestjs/common';
import { PatientService } from './services/patient/patient.service';
import { PatientController } from './controllers/patient/patient.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { PatientIdentifier } from './entities/identifier.entity';
import { PatientTelecom } from './entities/telecom.entity';
import { KeycloakModule } from '../keycloak/keycloak.module';

@Module({
  imports: [TypeOrmModule.forFeature([Patient, PatientIdentifier, PatientTelecom]), KeycloakModule],
  controllers: [PatientController],
  providers: [PatientService],
  exports: [PatientService],
})
export class PatientModule {}
