import { Repository } from 'typeorm';
import { UpdateBasicDataDto } from './dto/update/UpdateBasicData.dto';
import { PractitionerQualificationDto } from './dto/update/UpdateQualifications.dto';
import { UpdateIdentifierDto } from './dto/update/UpdateIdentifier.dto';
import { Practitioner, PractitionerIdentifier, PractitionerQualification, PractitionerTelecom } from './entities';
import { CreateTelecomDto } from './dto';
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

export interface UpdateProfile {
  profile?: UpdateBasicDataDto;
  telecom?: CreateTelecomDto[];
  qualifications?: PractitionerQualificationDto[];
  identifiers?: UpdateIdentifierDto[];
}

export type ProfileModuleValues = keyof UpdateProfile;
export type AvailableUpdates = Record<ProfileModuleValues, (data: UpdateProfile[keyof UpdateProfile]) => Promise<void>>;

export type PractitionerUpdaterEntities = Repository<PractitionerTelecom | Practitioner | PractitionerQualification | PractitionerIdentifier>
export type PractitionerUpdaterData = PractitionerTelecom | Practitioner | PractitionerQualification | PractitionerIdentifier
