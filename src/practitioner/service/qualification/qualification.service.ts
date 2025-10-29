import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { QualificationCode } from '../../entities/qualification-codes.entity';
import { PractitionerQualificationDto } from '../../dto';
import { PractitionerQualification } from '../../entities';
import { PRACTITIONER_ERROR_CODES } from '../../errors.codes';
import { UpdaterService } from '../../../shared/services/updater/updater.service';

@Injectable()
export class QualificationService {
  constructor(
    @InjectRepository(QualificationCode)
    private readonly qualificationCodeRepository: Repository<QualificationCode>,
    @InjectRepository(PractitionerQualification)
    private readonly practitionerQualificationRepository: Repository<PractitionerQualification>,
  ) {}

  public async getAllQualifications(): Promise<QualificationCode[]> {
    return await this.qualificationCodeRepository.find();
  }

  public async update(data: PractitionerQualificationDto[], practitionerId: string) {
    try {
      const entities = data.map((dto) => ({
        ...dto,
        practitionerId: practitionerId,
      }));
      const where = { practitionerId };
      await UpdaterService.upsert(this.practitionerQualificationRepository, entities, 'code', { practitionerId });
    } catch (error: unknown) {
      if (!(error instanceof QueryFailedError)) {
        throw error;
      }

      const driverErrorWithCode = error.driverError as { code: string };
      const code: string = driverErrorWithCode.code;
      const isKnownErrorCode = Object.values(PRACTITIONER_ERROR_CODES).includes(code as PRACTITIONER_ERROR_CODES);

      if (!isKnownErrorCode) {
        throw error;
      }

      throw new HttpException(PRACTITIONER_ERROR_CODES[code as PRACTITIONER_ERROR_CODES], 400);
    }
  }
}
