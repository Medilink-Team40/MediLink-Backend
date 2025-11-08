import { HttpException, HttpStatus } from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UpdaterService } from '../../../shared/services/updater/updater.service';
import { PRACTITIONER_ERROR, PRACTITIONER_ERROR_CODES } from '../../../practitioner/errors.codes';
import { CreateTelecomDto, UpdateBasicDataDto, UpdateIdentifierDto } from '../../dto';
import { Practitioner, PractitionerIdentifier, PractitionerTelecom } from '../../../practitioner/entities';
import { Patient } from '../../../patient/entities/patient.entity';
import { PatientTelecom } from '../../../patient/entities/telecom.entity';
import { PatientIdentifier } from '../../../patient/entities/identifier.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

/**
 */

export interface Entities {
  profile: Practitioner | Patient;
  telecom: PractitionerTelecom | PatientTelecom;
  identifiers: PatientIdentifier | PractitionerIdentifier;
}

export class PersonUpdater<P extends Entities> {
  private idField;

  constructor(
    private readonly userId: string,
    private readonly telecomRepository: Repository<P['telecom']>,
    private readonly profileRepository: Repository<P['profile']>,
    private readonly identifiersRepository: Repository<P['identifiers']>,
    private readonly entity: new () => Patient | Practitioner,
  ) {
    this.idField = entity === Practitioner ? 'practitionerId' : 'patientId';
  }

  private matchParent<K extends keyof Entities>(key: K) {
    return { [this.idField]: this.userId } as FindOptionsWhere<P[K]>;
  }

  public async telecom(telecomData: CreateTelecomDto[], email: string) {
    const incomingValues = telecomData.map(({ value }) => value).filter(Boolean);

    if (incomingValues.includes(email)) {
      throw new HttpException(PRACTITIONER_ERROR[PRACTITIONER_ERROR_CODES.ERROR_001], HttpStatus.BAD_REQUEST);
    }

    const telecomEntities = telecomData.map((dto) => ({
      ...dto,
      [this.idField]: this.userId,
    })) as Partial<P['telecom']>[];

    await UpdaterService.upsert<P['telecom'], 'value'>(
      this.telecomRepository,
      telecomEntities,
      'value',
      this.matchParent('telecom'),
    );
  }

  public async identifiers(data: UpdateIdentifierDto[]) {
    const entities = data.map((dto) => ({
      ...dto,
      [this.idField]: this.userId,
    })) as Partial<P['identifiers']>[];

    await UpdaterService.upsert(this.identifiersRepository, entities, 'value', this.matchParent('identifiers'));
  }

  public async profile(data: UpdateBasicDataDto) {
    const updateData = {} as QueryDeepPartialEntity<Patient & Practitioner>;

    if ('name' in data) updateData.name = data.name;
    if ('birthDate' in data) updateData.birthDate = data.birthDate;
    if ('gender' in data) updateData.gender = data.gender;
    if (typeof data.active === 'boolean') updateData.active = data.active;

    await this.profileRepository.update({ keycloakId: this.userId } as FindOptionsWhere<P['profile']>, updateData);
  }
}
