import { Body, Controller } from '@nestjs/common';
import { KeyCloakService } from '../../../keycloak/services/create/create.service';
import { KeycloakCreateDto } from '../../../keycloak/dto/KeycloakDto';
import { PatientRegisterDto } from '../../dto/PatientRegisterDto';
import { RolesTypes } from '../../../auth/auth.types';
import { PatientService } from '../../services/patient/patient.service';

@Controller('patient')
export class PatientController {
  constructor(
    private readonly keycloak: KeyCloakService,
    private readonly service: PatientService,
  ) {}

  public async create(@Body() patient: PatientRegisterDto) {
    const keycloakid = await this.keycloak.createUserAndAssignRole(new KeycloakCreateDto(patient), RolesTypes.PATIENT);

    const user = await this.service.create(patient, keycloakid);
    return user;
  }
}
