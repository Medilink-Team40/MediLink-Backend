import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesTypes } from '../../../auth/auth.types';
import { Repository } from 'typeorm';
import {
  PractitionerQualificationDto,
  UpdateProfileDto,
  UpdateBasicDataDto,
  PractitionerRegisterDto,
  CreateTelecomDto,
} from '../../../practitioner/dto/';
import { CalendarService } from '../../../calendar/calendar.service';
import { Practitioner, PractitionerIdentifier, PractitionerQualification } from '../../../practitioner/entities';
import { AvailableUpdates, UpdateProfile } from '../../../practitioner/practitioner.types';
import { PractitionerUpdaterFactory } from '../../../practitioner/factory/updater.factory';
import { CalendarEntity } from '../../../calendar/entity/calendar.entity';

@Injectable()
export class PractitionerService {
  constructor(
    @InjectRepository(Practitioner)
    private readonly repository: Repository<Practitioner>,
    @InjectRepository(PractitionerQualification)
    private readonly updaterFactory: PractitionerUpdaterFactory,
    @InjectRepository(CalendarEntity)
    private readonly calendarRepo: Repository<CalendarEntity>,
    private readonly calendarService: CalendarService,
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
    const savedPractitioner = await this.repository.save(newPractitioner);
    await this.calendarService.createOrGetCalendar(id);
    return savedPractitioner;
  }

  public async update(practitioner: UpdateProfileDto & { userId: string; email: string }) {
    const promises: Promise<void>[] = [];

    const { userId, email, ...updatedData } = practitioner;
    const updater = this.updaterFactory.create(practitioner.userId);
    const modulesToUpdate = Object.keys(updatedData);
    const updates: AvailableUpdates = {
      ['telecom']: (data: CreateTelecomDto[]) => updater.telecom(data, email),
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

  public async findByQualification(qualificationCode: string): Promise<Practitioner[]> {
    return await this.repository
      .createQueryBuilder('practitioner')
      .leftJoinAndSelect('practitioner.qualification', 'qualification')
      .where('qualification.code = :qualificationCode', { qualificationCode })
      .leftJoinAndSelect('practitioner.telecom', 'telecom')
      .leftJoinAndSelect('practitioner.identifier', 'identifier')
      .leftJoinAndSelect('practitioner.calendar', 'calendar')
      .getMany();
  }

  public async findAllWithCalendar(): Promise<Practitioner[]> {
    return await this.repository.find({
      relations: ['telecom', 'qualification', 'identifier', 'calendar'],
    });
  }
}
