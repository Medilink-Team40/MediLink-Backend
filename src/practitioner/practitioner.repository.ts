import { Injectable } from '@nestjs/common';
import { PractitionerRegisterDto } from '../person/dto/CreatePersonDto';
import { IPractitionerRepository } from './practitioner.dao';

@Injectable()
export class PractitionerRepository implements IPractitionerRepository {
  public create(practitioner: PractitionerRegisterDto) {
    return 'uuid';
  }
}
