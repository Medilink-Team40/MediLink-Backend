import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PractitionerIdentifier, PractitionerTelecom, Practitioner, PractitionerQualification } from '../entities';
import { Repository } from 'typeorm';
import { PractitionerUpdater } from '../service/practitioner/updater.service';

@Injectable()
export class PractitionerUpdaterFactory {
  constructor(
    @InjectRepository(PractitionerTelecom) private readonly telecomRepo: Repository<PractitionerTelecom>,
    @InjectRepository(Practitioner) private readonly profileRepo: Repository<Practitioner>,
    @InjectRepository(PractitionerQualification)
    private readonly qualificationsRepo: Repository<PractitionerQualification>,
    @InjectRepository(PractitionerIdentifier) private readonly identifiersRepo: Repository<PractitionerIdentifier>,
  ) {}

  create(userId: string): PractitionerUpdater {
    return new PractitionerUpdater(
      userId,
      this.telecomRepo,
      this.profileRepo,
      this.qualificationsRepo,
      this.identifiersRepo,
    );
  }
}
