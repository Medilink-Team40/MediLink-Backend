import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesTypes } from 'src/auth/auth.types';
import { PractitionerRegisterDto } from 'src/practitioner/dto/PractitionerRegisterDto';
import { PractitionerTelecomDto } from 'src/practitioner/dto/Telecom.dto';
import { UpdateBasicDataDto } from 'src/practitioner/dto/update/UpdateBasicData.dto';
import { UpdateProfileDto } from 'src/practitioner/dto/update/UpdateProfile.dto';
import { PractitionerQualificationDto } from 'src/practitioner/dto/update/UpdateQualifications.dto';
import { Practitioner, PractitionerIdentifier, PractitionerTelecom } from 'src/practitioner/entities';
import { PRACTITIONER_ERROR, PRACTITIONER_ERROR_CODES } from 'src/practitioner/errors.codes';
import { AvailableUpdates, UpdateProfile } from 'src/practitioner/practitioner.types';
import { Repository } from 'typeorm';

@Injectable()
export class PractitionerService {
  constructor(
    @InjectRepository(Practitioner)
    private readonly repository: Repository<Practitioner>,
    @InjectRepository(PractitionerTelecom)
    private readonly telecomRepository: Repository<PractitionerTelecom>,
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

  public async getByKeyCloakId(id: string) {
    return await this.repository.findOneBy({ keycloakId: id });
  }

  public async updateTelecom(practitionerId: string, telecomData: PractitionerTelecomDto[], email: string) {
    const existingRecords = await this.telecomRepository.findBy({ practitionerId });
    const incomingValues = telecomData.map(({ value }) => value).filter((value) => !!value);

    if (incomingValues.includes(email))
      throw new HttpException(PRACTITIONER_ERROR[PRACTITIONER_ERROR_CODES['001']], HttpStatus.BAD_REQUEST);

    const recordsToDelete = existingRecords.filter(
      (existing) => existing.value && !incomingValues.includes(existing.value),
    );

    if (recordsToDelete.length > 0) {
      await this.telecomRepository.remove(recordsToDelete);
    }

    const recordsToSave = telecomData.map((dto) => ({
      ...dto,
      practitionerId,
    }));

    await this.telecomRepository.save(recordsToSave as PractitionerTelecom[]);
  }

  public async updateQualifications(userId: string, data: PractitionerIdentifier[]) {}
  public async updateIdentifiers(userId: string, data: PractitionerQualificationDto[]) {}
  public async updateProfile(userId: string, data: UpdateBasicDataDto) {}

  public async update(practitioner: UpdateProfileDto & { userId: string; email: string }) {
    let promises: void[] = [];

    const { userId, email, ...updatedData } = practitioner;
    const modulesToUpdate = Object.keys(updatedData);
    const updates: AvailableUpdates = {
      ['telecom']: (data: PractitionerTelecomDto[]) => this.updateTelecom(userId, data, email),
      ['qualifications']: (data: PractitionerIdentifier[]) => this.updateQualifications(userId, data),
      ['identifiers']: (data: PractitionerQualificationDto[]) => this.updateIdentifiers(userId, data),
      ['profile']: (data: UpdateBasicDataDto) => this.updateProfile(userId, data),
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
}
