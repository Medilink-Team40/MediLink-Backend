import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QualificationCode } from 'src/practitioner/entities/qualification-codes.entity';
import { Repository } from 'typeorm';

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
