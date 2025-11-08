import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Patient } from '../patient/entities/patient.entity';
import { PatientTelecom } from '../patient/entities/telecom.entity';
import { PatientIdentifier } from '../patient/entities/identifier.entity';
import { Practitioner } from '../practitioner/entities/practitioner.entity';
import { PractitionerTelecom } from '../practitioner/entities/telecom.entity';
import { PractitionerIdentifier } from '../practitioner/entities/identifier.entity';

import { PersonUpdaterFactory } from './factory/person-updater.factory';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Patient,
      PatientTelecom,
      PatientIdentifier,
      Practitioner,
      PractitionerTelecom,
      PractitionerIdentifier,
    ]),
  ],
  providers: [PersonUpdaterFactory],
  exports: [PersonUpdaterFactory, TypeOrmModule],
})
export class PersonModule {}
