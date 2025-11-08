import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PersonUpdater } from '../service/person/person-update.service';
import { Practitioner, PractitionerTelecom, PractitionerIdentifier } from '../../practitioner/entities';
import { RepositoryMap } from '../../types/person.types';
import { PatientTelecom } from '../../patient/entities/telecom.entity';
import { Patient } from '../../patient/entities/patient.entity';
import { PatientIdentifier } from '../../patient/entities/identifier.entity';

@Injectable()
export class PersonUpdaterFactory {
  private repositories: Map<Function, RepositoryMap[keyof RepositoryMap]>;

  constructor(
    // Practitioner repos
    @InjectRepository(PractitionerTelecom)
    private readonly prTelecom: Repository<PractitionerTelecom>,
    @InjectRepository(Practitioner)
    private readonly prProfile: Repository<Practitioner>,
    @InjectRepository(PractitionerIdentifier)
    private readonly prIdentifiers: Repository<PractitionerIdentifier>,

    // Patient repos
    @InjectRepository(PatientTelecom)
    private readonly paTelecom: Repository<PatientTelecom>,
    @InjectRepository(Patient)
    private readonly paProfile: Repository<Patient>,
    @InjectRepository(PatientIdentifier)
    private readonly paIdentifiers: Repository<PatientIdentifier>,
  ) {
    this.repositories = new Map();

    this.repositories.set(Practitioner, {
      telecom: this.prTelecom,
      profile: this.prProfile,
      identifiers: this.prIdentifiers,
    });

    this.repositories.set(Patient, {
      telecom: this.paTelecom,
      profile: this.paProfile,
      identifiers: this.paIdentifiers,
    });
  }

  public create<T extends Practitioner | Patient>(userId: string, entity: new () => T) {
    const repos = this.repositories.get(entity);
    if (!repos) throw new Error(`No repositories found for ${entity.name}`);

    return new PersonUpdater(userId, repos.telecom, repos.profile, repos.identifiers, entity);
  }
}
