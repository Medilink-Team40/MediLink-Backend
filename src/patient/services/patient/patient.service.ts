import { Injectable } from '@nestjs/common';
import { PatientRegisterDto } from '../../dto/PatientRegisterDto';
import { Patient } from '../../entities/patient.entity';
import { RolesTypes } from '../../../auth/auth.types';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PersonUpdaterFactory } from '../../../person/factory/person-updater.factory';
import { PersonService } from '../../../person/service/person/person.service';

@Injectable()
export class PatientService extends PersonService<Patient> {
  constructor(
    @InjectRepository(Patient)
    private readonly repo: Repository<Patient>,
    protected readonly updaterFactory: PersonUpdaterFactory,
  ) {
    super(repo, updaterFactory, Patient);
  }

  public async create(dto: PatientRegisterDto, id: string) {
    const { repeatpassword, password, ...requiredData } = dto;
    const entity = {
      ...requiredData,
      keycloakId: id,
      active: false,
      role: RolesTypes.PATIENT,
    } as unknown as Patient;

    const newPractitioner = this.repository.create(entity);
    return await this.repository.save(newPractitioner);
  }
}
