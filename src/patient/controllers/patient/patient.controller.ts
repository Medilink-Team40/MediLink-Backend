import { Body, Controller, Post } from '@nestjs/common';
import { KeyCloakService } from '../../../keycloak/services/create/create.service';
import { KeycloakCreateDto } from '../../../keycloak/dto/KeycloakDto';
import { RolesTypes } from '../../../auth/auth.types';
import { PatientService } from '../../services/patient/patient.service';
import { CreatePersonDto } from '../../../practitioner/dto';
import { CatchError } from '../../../decorators/errors.decorator';

@Controller('patient')
export class PatientController {
  constructor(
    private readonly keycloak: KeyCloakService,
    private readonly service: PatientService,
  ) {}

  @Post('register-patient')
  @CatchError()
  public async create(@Body() patient: CreatePersonDto) {
    const keycloakid = await this.keycloak.createUserAndAssignRole(new KeycloakCreateDto(patient), RolesTypes.PATIENT);
    const user = await this.service.create(patient, keycloakid, RolesTypes.PATIENT);
    return user;
  }
}
