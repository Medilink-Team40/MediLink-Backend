import { UpdateIdentifierDto } from "../person/dto";
import { NameStructDto } from "../person/dto/NameStruct.dto";
import { CreateTelecomDto, UpdateBasicDataDto } from "../practitioner/dto";
import { FHIRExternalGender } from "../types/fhir.types";

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


export type ProfileModuleValues = keyof UpdatePerson;
export type AvailableUpdates = Record<ProfileModuleValues, (data: UpdatePerson[keyof UpdatePerson]) => void>;