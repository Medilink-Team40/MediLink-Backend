import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Practitioner } from '../../../practitioner/entities';
import { PractitionerUpdaterFactory } from '../../../person/factory/person-updater.factory';
import { PersonService } from '../../../person/service/person/person.service';

@Injectable()
export class PractitionerService extends PersonService<Practitioner> {
  constructor(
    @InjectRepository(Practitioner)
    private readonly practitionerRepo: Repository<Practitioner>,
    protected readonly updaterFactory: PractitionerUpdaterFactory,
  ) {
    super(practitionerRepo, updaterFactory);
  }

  public async findOne(keycloakId: string): Promise<Practitioner | null> {
    return await this.practitionerRepo.findOne({
      where: { keycloakId },
      relations: ['telecom', 'identifier', 'calendar'],
    });
  }
}
