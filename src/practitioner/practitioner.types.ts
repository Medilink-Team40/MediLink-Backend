import { Repository } from 'typeorm';
import { PractitionerQualificationDto } from './dto/UpdateQualifications.dto';
import { Practitioner, PractitionerIdentifier, PractitionerQualification, PractitionerTelecom } from './entities';
import { UpdatePerson } from '../types/person.types';
export enum PractitionerIdentifierType {
  NI = 'NI',   // Número de matrícula profesional
  PRO = 'PRO', // Profesional
  ESP = 'ESP', // Especialidad
}

export interface QualificationCodes {
  system: string;
  code: string;
  display: string;
}

export interface UpdatePractitionerProfile extends UpdatePerson {
  qualifications?: PractitionerQualificationDto[];
}

export type PractitionerUpdaterEntities = Repository<PractitionerTelecom | Practitioner | PractitionerQualification | PractitionerIdentifier>
export type PractitionerUpdaterData = PractitionerTelecom | Practitioner | PractitionerQualification | PractitionerIdentifier