import { Patient } from "../patient/entities/patient.entity";
import { UpdateIdentifierDto } from "../person/dto";
import { NameStructDto } from "../person/dto/NameStruct.dto";
import { CreateTelecomDto, UpdateBasicDataDto } from "../practitioner/dto";
import { Practitioner } from "../practitioner/entities";
import { FHIRExternalGender, FHIRTelecomSystem, TelecomUses } from "../types/fhir.types";

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

export interface TelecomEntity{
  id: string;
  system: FHIRTelecomSystem;
  value: string;
  use: TelecomUses;
  rank: number;
  practitioner: Practitioner | Patient;
  practitionerId: string;
}


export type ProfileModuleValues = keyof UpdatePerson;
export type AvailableUpdates = Record<ProfileModuleValues, (data: UpdatePerson[keyof UpdatePerson]) => void>;