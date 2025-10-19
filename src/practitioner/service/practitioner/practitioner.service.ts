import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesTypes } from 'src/auth/auth.types';
import { PractitionerRegisterDto } from 'src/practitioner/dto/PractitionerRegisterDto';
import { Practitioner, PractitionerTelecom } from 'src/practitioner/entities';
import { Repository } from 'typeorm';

@Injectable()
export class PractitionerService {
  constructor(
    @InjectRepository(Practitioner)
    private readonly repository: Repository<Practitioner>,
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
}
