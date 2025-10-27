import { HttpException, HttpStatus } from '@nestjs/common';
import { UpdateIdentifierDto } from '../../../practitioner/dto/update';
import { UpdateBasicDataDto } from '../../../practitioner/dto/update/UpdateBasicData.dto';
import { PractitionerQualificationDto } from '../../../practitioner/dto/update/UpdateQualifications.dto';
import {
  Practitioner,
  PractitionerIdentifier,
  PractitionerQualification,
  PractitionerTelecom,
} from '../../../practitioner/entities';
//'src/practitioner/entities';
import { PRACTITIONER_ERROR, PRACTITIONER_ERROR_CODES } from '../../errors.codes';
//import { PractitionerUpdaterData, PractitionerUpdaterEntities } from '../../../practitioner/practitioner.types';
import { DeepPartial, FindOptionsWhere, ObjectLiteral, QueryFailedError, Repository } from 'typeorm';
import { CreateTelecomDto } from '../../dto';

export class PractitionerUpdater {
  constructor(
    private readonly user: string,
    private readonly telecomRepository: Repository<PractitionerTelecom>,
    private readonly profileRepository: Repository<Practitioner>,
    private readonly qualificationsRepository: Repository<PractitionerQualification>,
    private readonly identifiersRepository: Repository<PractitionerIdentifier>,
  ) {}

  public async upsert<T extends ObjectLiteral>(repository: Repository<T>, data: Partial<T>[], filterColumn: keyof T) {
    const existingRecords = await repository.findBy({ practitionerId: this.user } as unknown as FindOptionsWhere<T>);
    const incomingValues = data
      .map((item: Partial<T>): T[keyof T] | undefined => {
        const columnValue: T[keyof T] | undefined = item[filterColumn];
        return columnValue;
      })
      .filter((value): value is T[keyof T] => !!value);

    const recordsToDelete = existingRecords.filter(
      (record) => record[filterColumn] && !incomingValues.includes(record[filterColumn]),
    );

    if (recordsToDelete.length > 0) {
      await repository.remove(recordsToDelete);
    }

    const recordsToSaveOrUpdate = data.map((dto) => {
      const entityData = { ...dto, practitionerId: this.user };
      const existingMatch = existingRecords.find((e) => e[filterColumn] === dto[filterColumn]);

      if (existingMatch) {
        return repository.merge(existingMatch, entityData as unknown as DeepPartial<T>);
      }

      return repository.create(entityData as unknown as DeepPartial<T>);
    });

    if (recordsToSaveOrUpdate.length > 0) {
      await repository.save(recordsToSaveOrUpdate);
    }
  }

  public async telecom(telecomData: CreateTelecomDto[], email: string) {
    const incomingValues = telecomData.map(({ value }) => value).filter((value) => !!value);
    if (incomingValues.includes(email)) {
      throw new HttpException(PRACTITIONER_ERROR[PRACTITIONER_ERROR_CODES.ERROR_001], HttpStatus.BAD_REQUEST);
    }

    await this.upsert<PractitionerTelecom>(this.telecomRepository, telecomData, 'value');
  }

  public async qualifications(data: PractitionerQualificationDto[]) {
    try {
      const entities = data.map((dto) => ({
        ...dto,
        practitionerId: this.user,
      }));
      await this.upsert<PractitionerQualification>(this.qualificationsRepository, entities, 'code');
    } catch (error: unknown) {
      if (!(error instanceof QueryFailedError)) {
        throw error;
      }

      const driverErrorWithCode = error.driverError as { code: string };
      const code: string = driverErrorWithCode.code;
      // Check if the code exists as a value in PRACTITIONER_ERROR_CODES
      const isKnownErrorCode = Object.values(PRACTITIONER_ERROR_CODES).includes(code as PRACTITIONER_ERROR_CODES);

      if (!isKnownErrorCode) {
        throw error;
      }

      // If it's a known error code, then PRACTITIONER_ERROR[code] will be valid.
      throw new HttpException(PRACTITIONER_ERROR[code as PRACTITIONER_ERROR_CODES], 400);
    }
  }

  public async identifiers(data: UpdateIdentifierDto[]) {
    const entities = data.map((dto) => ({
      ...dto,
      practitionerId: this.user,
    }));

    await this.upsert<PractitionerIdentifier>(this.identifiersRepository, entities, 'value');
  }

  public async profile(data: UpdateBasicDataDto) {
    const updateData: Partial<Practitioner> = {};

    if (data.name) updateData.name = data.name;
    if (data.birthDate) updateData.birthDate = data.birthDate;
    if (data.gender) updateData.gender = data.gender;
    if (typeof data.active === 'boolean') updateData.active = data.active;

    await this.profileRepository.update({ keycloakId: this.user }, updateData);
  }
}
