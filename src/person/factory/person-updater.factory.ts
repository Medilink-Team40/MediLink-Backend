import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  PractitionerIdentifier,
  PractitionerTelecom,
  Practitioner,
} from '../../practitioner/entities';
import { Repository } from 'typeorm';
import { PersonUpdater } from '../service/person/person-update.service';

@Injectable()
export class PractitionerUpdaterFactory {
  constructor(
    @InjectRepository(PractitionerTelecom)
    private readonly telecomRepo: Repository<PractitionerTelecom>,

    @InjectRepository(Practitioner)
    private readonly profileRepo: Repository<Practitioner>,

    @InjectRepository(PractitionerIdentifier)
    private readonly identifiersRepo: Repository<PractitionerIdentifier>,

  ) {}

  create(userId: string): PersonUpdater {
    return new PersonUpdater(
      userId,
      this.telecomRepo,
      this.profileRepo,
      this.identifiersRepo,
    );
  }
}
