import { Body, Controller } from '@nestjs/common';
import { KeyCloakService } from '../../../keycloak/services/create/create.service';
import { KeycloakCreateDto } from '../../../keycloak/dto/KeycloakDto';
import { PatientRegisterDto } from '../../dto/PatientRegisterDto';
import { RolesTypes } from '../../../auth/auth.types';

@Controller('patient')
export class PatientController {
  constructor(private readonly keycloak: KeyCloakService) {}

  public async create(@Body() patient: PatientRegisterDto) {
    const keycloakid = await this.keycloak.createUserAndAssignRole(new KeycloakCreateDto(patient), RolesTypes.PATIENT);

    const user = await this.service.create(practitioner, keycloakid);
    return user;
  }
}
