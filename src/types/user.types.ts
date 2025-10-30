import { NameStructDto } from '../dto/fhir/NameStruct.dto';

export interface UserBaseCreation {
  email: string;
  name: NameStructDto[];
  password: string;
}
