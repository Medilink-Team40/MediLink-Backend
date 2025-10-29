import { Injectable } from '@nestjs/common';
import { PatientRegisterDto } from '../../dto/PatientRegisterDto';
import { Patient } from '../../entities/patient.entity';
import { RolesTypes } from '../../../auth/auth.types';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PersonService } from '../../../person/service/person/person.service';
import { PersonUpdaterFactory } from '../../../person/factory/person-updater.factory';

@Injectable()
export class PatientService extends PersonService<Patient> {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,
    protected readonly updaterFactory: PersonUpdaterFactory,
  ) {
    super(patientRepo, updaterFactory);
  }
}
