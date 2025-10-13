import { PractitionerRegisterDto } from './dto/PractitionerRegisterDto';
export const PRACTITIONER_REPOSITORY = 'PractitionerRepository'; 

export interface IPractitionerRepository {
  create: (practitioner: PractitionerRegisterDto) => string;
}
