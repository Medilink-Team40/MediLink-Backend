import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PractitionerRegisterDto } from 'src/practitioner/dto/PractitionerRegisterDto';
import { Practitioner, PractitionerTelecom } from 'src/practitioner/entities';
import { Repository } from 'typeorm';

@Injectable()
export class PractitionerService {
  constructor(
    @InjectRepository(Practitioner)
    private readonly repository: Repository<Practitioner>,
  ) {}

  public async create(dto: PractitionerRegisterDto) {
    const { repeatpassword, password, telecom, ...requiredData } = dto;
    const entity = {
      ...requiredData,
      keycloakId: 'test123test',
      active: false,
      telecom: [
        ...telecom.map((element, index) => ({ ...element, rank: index + 1 })),
      ] as PractitionerTelecom[],
    };
    console.log("🚀 ~ PractitionerService ~ create ~ entity:", entity)

    //const newPractitioner = this.repository.create(entity);
  }
}
