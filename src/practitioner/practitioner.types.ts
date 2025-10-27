import { Repository } from 'typeorm';
import { PractitionerTelecomDto } from './dto/Telecom.dto';
import { UpdateBasicDataDto } from './dto/update/UpdateBasicData.dto';
import { PractitionerQualificationDto } from './dto/update/UpdateQualifications.dto';
import { UpdateIdentifierDto } from './dto/update/UpdateIdentifier.dto';
import { Practitioner, PractitionerIdentifier, PractitionerQualification, PractitionerTelecom } from './entities';

export enum FHIRExternalGender {
  FEMALE = 'female',
  MALE = 'male',
  OTHER = 'other',
  UNKNOWN = 'unknown',
}

export enum FHIRIdentifierUse {
  USUAL = 'usual',
  OFFICIAL = 'official',
  TEMP = 'temp',
  SECONDARY = 'secondary',
}

export enum FHIRTelecomSystem {
  PHONE = 'phone',
  FAX = 'fax',
  EMAIL = 'email',
  PAGER = 'pager',
  URL = 'url',
  SMS = 'sms',
}

export const SYSTEM_INTERN = "https://medilink-backend-production-3d65.up.railway.app/api"

export interface NameStruct {
  use: string;
  text: string;
  family: string;
  given: string[];
}

export enum PractitionerIdentifierType {
  NI = 'NI',   // Número de matrícula profesional
  PRO = 'PRO', // Profesional
  ESP = 'ESP', // Especialidad
}

export enum TelecomUses {
  WORK = 'work',
  PERSONAL = 'personal',
  FAMILY = 'family',
}

export interface QualificationCodes {
  system: string;
  code: string;
  display: string;
}

export interface UpdateProfile {
  profile?: UpdateBasicDataDto;
  telecom?: PractitionerTelecomDto[];
  qualifications?: PractitionerQualificationDto[];
  identifiers?: UpdateIdentifierDto[];
}

export type ProfileModuleValues = keyof UpdateProfile;
export type AvailableUpdates = Record<ProfileModuleValues, (data: UpdateProfile[keyof UpdateProfile]) => void>;

export type PractitionerUpdaterEntities = Repository<PractitionerTelecom | Practitioner | PractitionerQualification | PractitionerIdentifier>
export type PractitionerUpdaterData = PractitionerTelecom | Practitioner | PractitionerQualification | PractitionerIdentifier