import { NameStructDto } from 'src/practitioner/dto/NameStruct.dto';

export interface UserBaseCreation {
  email: string;
  name: NameStructDto[];
  password: string;
}
