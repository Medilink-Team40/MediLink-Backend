import { PractitionerTelecomDto } from './dto/Telecom.dto';
import { UpdateBasicDataDto } from './dto/update/UpdateBasicData.dto';
import { PractitionerQualificationDto } from './dto/update/UpdateQualifications.dto';
import { PractitionerIdentifier } from './entities';

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

export interface NameStruct {
  use: string;
  text: string;
  family: string;
  given: string[];
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
  identifiers?: PractitionerIdentifier[];
}

export type ProfileModuleValues = keyof UpdateProfile;

export type AvailableUpdates = Record<ProfileModuleValues, (data: UpdateProfile[keyof UpdateProfile]) => void>


