import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesTypes } from '../../../auth/auth.types';
import { Repository } from 'typeorm';
import {
  PractitionerQualificationDto,
  UpdateProfileDto,
  UpdateBasicDataDto,
  PractitionerRegisterDto,
  PractitionerTelecomDto,
} from '../../../practitioner/dto/';
import { Practitioner, PractitionerIdentifier } from '../../../practitioner/entities';
import { AvailableUpdates, UpdateProfile } from '../../../practitioner/practitioner.types';
import { PractitionerUpdaterFactory } from '../../../practitioner/factory/updater.factory';

@Injectable()
export class PractitionerService {
  constructor(
    @InjectRepository(Practitioner)
    private readonly repository: Repository<Practitioner>,
    private readonly updaterFactory: PractitionerUpdaterFactory,
  ) {}

  public async create(dto: PractitionerRegisterDto, id: string) {
    const { repeatpassword, password, ...requiredData } = dto;
    const entity = {
      ...requiredData,
      keycloakId: id,
      active: false,
      role: RolesTypes.PRACTITIONER,
    } as unknown as Practitioner;

    const newPractitioner = this.repository.create(entity);
    return await this.repository.save(newPractitioner);
  }

  public async update(practitioner: UpdateProfileDto & { userId: string; email: string }) {
    let promises: void[] = [];

    const { userId, email, ...updatedData } = practitioner;
    const updater = this.updaterFactory.create(practitioner.userId);
    const modulesToUpdate = Object.keys(updatedData);
    const updates: AvailableUpdates = {
      ['telecom']: (data: PractitionerTelecomDto[]) => updater.telecom(data, email),
      ['qualifications']: (data: PractitionerQualificationDto[]) => updater.qualifications(data),
      ['identifiers']: (data: PractitionerIdentifier[]) => updater.identifiers(data),
      ['profile']: (data: UpdateBasicDataDto) => updater.profile(data),
    };

    const data: Record<keyof UpdateProfile, UpdateProfile[keyof UpdateProfile]> = {
      telecom: practitioner.telecom,
      qualifications: practitioner.qualifications,
      identifiers: practitioner.identifiers,
      profile: practitioner.profile,
    };

    modulesToUpdate.forEach((name: keyof UpdateProfileDto) => {
      if (!updates?.[name] || !data[name]) return;
      promises.push(updates[name](data[name]));
    });

    if (promises.length > 0) await Promise.all(promises);
  }

  public async findOne(keycloakId: string): Promise<Practitioner | null> {
    return await this.repository.findOne({
      where: { keycloakId },
      relations: ['telecom', 'qualification', 'identifier', 'calendar'],
    });
  }
}
