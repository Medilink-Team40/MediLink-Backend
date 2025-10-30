import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QualificationCode } from '../../entities/qualification-codes.entity';

@Injectable()
export class QualificationService {
  constructor(
    @InjectRepository(QualificationCode)
    private readonly qualificationCodeRepository: Repository<QualificationCode>,
  ) {}

  public async getAllQualifications(): Promise<QualificationCode[]> {
    return await this.qualificationCodeRepository.find();
  }
}
