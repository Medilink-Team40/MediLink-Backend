import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesTypes } from 'src/auth/auth.types';
import { PractitionerRegisterDto } from 'src/practitioner/dto/PractitionerRegisterDto';
import { PractitionerTelecomDto } from 'src/practitioner/dto/Telecom.dto';
import { UpdateProfileDto } from 'src/practitioner/dto/update/UpdateProfile.dto';
import { PractitionerQualificationDto } from 'src/practitioner/dto/update/UpdateQualifications.dto';
import { Practitioner, PractitionerIdentifier, PractitionerTelecom } from 'src/practitioner/entities';
import {
  AvailableEntities,
  AvailableUpdates,
  ProfileModuleKeys,
  UpdatableData,
  UpdatableDataTypes,
} from 'src/practitioner/practitioner.types';
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
    console.log('🚀 ~ PractitionerService ~ create ~ newPractitioner:', newPractitioner);
    return await this.repository.save(newPractitioner);
  }

  public async getByKeyCloakId(id: string) {
    return await this.repository.findOneBy({ keycloakId: id });
  }

  public async updateTelecom(practitionerId: string, telecomData: PractitionerTelecomDto[] | undefined) {
    if (!telecomData) return;

    // 1. Obtener todos los registros existentes para este practitioner
    const existingRecords = await this.telecomRepository.findBy({ practitionerId });

    // 2. Identificar registros a ELIMINAR (Upsert DELETE)
    // Son los IDs que están en DB pero no en los datos recibidos (telecomData)
    const incomingIds = telecomData.map((item) => item.id).filter((id) => id !== undefined);

    const recordsToDelete = existingRecords.filter((existing) => existing.id && !incomingIds.includes(existing.id));

    // 3. Ejecutar la eliminación
    if (recordsToDelete.length > 0) {
      await this.telecomRepository.remove(recordsToDelete);
    }

    const recordsToSave = telecomData.map((dto) => ({
      ...dto,
      practitionerId: practitionerId,
    }));

    // 5. Ejecutar la actualización/inserción
    this.telecomRepository.create(recordsToSave as PractitionerTelecom[]);

    console.log(`Actualización/Creación exitosa para telecom de ${practitionerId}.`);
  }
  public async updateQualifications(userId: string, data: PractitionerIdentifier) {}
  public async updateIdentifiers(userId: string, data: PractitionerQualificationDto) {}

  public async updateProfile(practitioner: UpdateProfileDto & { userId: string }) {
    let promises: Promise<void>[] = [];

    const { email, userId, ...updatedData } = practitioner;
    const modulesToUpdate = Object.keys(updatedData);
    const updates: AvailableUpdates = {
      ['telecom']: (data: PractitionerTelecomDto[] | undefined) => this.updateTelecom(userId, data),
      ['qualifications']: (data: PractitionerIdentifier) => this.updateQualifications(userId, data),
      ['identifiers']: (data: PractitionerQualificationDto) => this.updateIdentifiers(userId, data),
    };

    const data: Record<ProfileModuleKeys, UpdateProfileDto[ProfileModuleKeys]> = {
      telecom: practitioner.telecom,
      qualifications: practitioner.qualifications,
      identifiers: practitioner.identifiers,
    };

    modulesToUpdate.forEach((name: keyof UpdateProfileDto) => {
      if (!modulesToUpdate?.[name]) return;
      promises.push(updates[name](data[name]));
    });

    if (promises.length > 0) await Promise.all(promises);
  }
}
