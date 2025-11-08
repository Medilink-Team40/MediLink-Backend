import { Repository } from 'typeorm';
import { UpdateIdentifierDto } from '../person/dto';
import { NameStructDto } from '../person/dto/NameStruct.dto';
import { CreateTelecomDto, UpdateBasicDataDto } from '../practitioner/dto';
import { FHIRExternalGender } from '../types/fhir.types';
import { Practitioner, PractitionerIdentifier, PractitionerTelecom } from '../practitioner/entities';
import { PatientTelecom } from '../patient/entities/telecom.entity';
import { Patient } from '../patient/entities/patient.entity';
import { PatientIdentifier } from '../patient/entities/identifier.entity';

export interface PersonCreation {
  email: string;
  name: NameStructDto[];
  password: string;
}

export interface PersonUpdate {
  name?: NameStructDto[];
  birthDate?: Date;
  gender?: FHIRExternalGender;
  active?: boolean;
}

export interface UpdatePerson {
  profile?: UpdateBasicDataDto;
  telecom?: CreateTelecomDto[];
  identifiers?: UpdateIdentifierDto[];
}

export interface Repositories<P extends { profile: any; telecom: any; identifiers: any }> {
  profile: Repository<P['profile']>;
  telecom: Repository<P['telecom']>;
  identifiers: Repository<P['identifiers']>;
}

export interface PractitionerEntities {
  profile: Practitioner;
  telecom: PractitionerTelecom;
  identifiers: PractitionerIdentifier;
}

export interface PatientEntities {
  profile: Patient;
  telecom: PatientTelecom;
  identifiers: PatientIdentifier;
}

export type RepositoryMap = {
  Practitioner: Repositories<PractitionerEntities>;
  Patient: Repositories<PatientEntities>;
};

export type ProfileModuleValues = keyof UpdatePerson;
export type AvailableUpdates = Record<ProfileModuleValues, (data: UpdatePerson[keyof UpdatePerson]) => void>;
