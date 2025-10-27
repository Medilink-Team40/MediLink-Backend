import { Module } from '@nestjs/common';
import { PatientService } from './services/patient/patient.service';

@Module({
  providers: [PatientService],
})
export class PatientModule {}
