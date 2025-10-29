import { HttpException, HttpStatus } from '@nestjs/common';
import { UpdateIdentifierDto } from '../../dto/UpdateIdentifier.dto';
import { UpdateBasicDataDto } from '../../dto/UpdateBasicData.dto';
import { Practitioner, PractitionerIdentifier, PractitionerTelecom } from '../../../practitioner/entities';
import { PRACTITIONER_ERROR, PRACTITIONER_ERROR_CODES } from '../../../practitioner/errors.codes';
import { Repository } from 'typeorm';
import { CreateTelecomDto } from '../../dto/Telecom.dto';
import { UpdaterService } from '../../../shared/services/updater/updater.service';

export class PersonUpdater {
  constructor(
    private readonly user: string,
    private readonly telecomRepository: Repository<PractitionerTelecom>,
    private readonly profileRepository: Repository<Practitioner>,
    private readonly identifiersRepository: Repository<PractitionerIdentifier>,
  ) {}

  public async telecom(telecomData: CreateTelecomDto[], email: string) {
    const incomingValues = telecomData.map(({ value }) => value).filter((value) => !!value);
    if (incomingValues.includes(email)) {
      throw new HttpException(PRACTITIONER_ERROR[PRACTITIONER_ERROR_CODES.ERROR_001], HttpStatus.BAD_REQUEST);
    }

    await UpdaterService.upsert(this.telecomRepository, telecomData, 'value', { practitionerId: this.user });
  }

  public async identifiers(data: UpdateIdentifierDto[]) {
    const entities = data.map((dto) => ({
      ...dto,
      practitionerId: this.user,
    }));

    await UpdaterService.upsert(this.identifiersRepository, entities, 'value', { practitionerId: this.user });
  }

  public async profile(data: UpdateBasicDataDto) {
    const updateData: Partial<Practitioner> = {};

    if (data.name) updateData.name = data.name;
    if (data.birthDate) updateData.birthDate = data.birthDate;
    if (data.gender) updateData.gender = data.gender;
    if (typeof data.active === 'boolean') updateData.active = data.active;

    await this.profileRepository.update({ keycloakId: this.user }, updateData);
  }
}
