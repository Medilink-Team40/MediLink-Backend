import { PractitionerRegisterDto } from '../person/dto/CreatePersonDto';
export const PRACTITIONER_REPOSITORY = 'PractitionerRepository';

export interface IPractitionerRepository {
  create: (practitioner: PractitionerRegisterDto) => string;
}
