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
