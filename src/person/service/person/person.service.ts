import { Injectable } from '@nestjs/common';
import { RolesTypes } from '../../../auth/auth.types';
import { ObjectLiteral, Repository } from 'typeorm';
import {
  CreatePersonDto,
  CreateTelecomDto,
  UpdateBasicDataDto,
  UpdateIdentifierDto,
  UpdateProfileDto,
} from '../../dto';
import { AvailableUpdates, UpdatePerson } from '../../../types/person.types';
import { PersonUpdaterFactory } from '../../factory/person-updater.factory';

@Injectable()
export abstract class PersonService<T extends ObjectLiteral> {
  constructor(
    protected readonly repository: Repository<T>,
    protected readonly updaterFactory: PersonUpdaterFactory,
  ) {}

  public async create(dto: CreatePersonDto, id: string, rol: RolesTypes.PATIENT | RolesTypes.PRACTITIONER) {
    const { repeatpassword, password, ...requiredData } = dto;
    const entity = {
      ...requiredData,
      keycloakId: id,
      active: false,
      role: rol,
    } as unknown as T;

    const newPractitioner = this.repository.create(entity);
    return await this.repository.save(newPractitioner);
  }

  public async update(person: UpdateProfileDto & { userId: string; email: string }) {
    let promises: void[] = [];

    const { userId, email, ...updatedData } = person;
    const updater = this.updaterFactory.create(person.userId);
    const modulesToUpdate = Object.keys(updatedData);
    const updates: AvailableUpdates = {
      ['telecom']: (data: CreateTelecomDto[]) => updater.telecom(data, email),
      ['identifiers']: (data: UpdateIdentifierDto[]) => updater.identifiers(data),
      ['profile']: (data: UpdateBasicDataDto) => updater.profile(data),
    };

    const data: Record<keyof UpdatePerson, UpdatePerson[keyof UpdatePerson]> = {
      telecom: person.telecom,
      identifiers: person.identifiers,
      profile: person.profile,
    };

    modulesToUpdate.forEach((name: keyof UpdateProfileDto) => {
      if (!updates?.[name] || !data[name]) return;
      promises.push(updates[name](data[name]));
    });

    if (promises.length > 0) await Promise.all(promises);
  }
}
