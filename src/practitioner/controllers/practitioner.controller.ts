import { Body, Controller, Post } from '@nestjs/common';
import { RolesTypes } from 'src/auth/auth.types';
import { CreateService } from 'src/keycloak/services/create/create.service';
import { PractitionerRegisterDto } from '../dto/PractitionerRegisterDto';
import { CatchError } from 'src/decorators/errors.decorator';
import { KeycloakCreateDto } from 'src/keycloak/dto/KeycloakDto';
import { PractitionerService } from '../service/practitioner/practitioner.service';

@Controller('practitioner')
export class PractitionerController {
  constructor(
    private readonly keycloak: CreateService,
    private readonly service: PractitionerService,
  ) {}

  //@UseGuards(AuthGuard(), RolesGuard)
  //@Roles(RolesTypes.ADMIN)
  @Post('register-practitioner')
  @CatchError()
  public async create(@Body() practitioner: PractitionerRegisterDto) {
    const keycloakid = await this.keycloak.createUserAndAssignRole(
      new KeycloakCreateDto(practitioner),
      RolesTypes.PRACTITIONER,
    );

    const user = await this.service.create(practitioner, keycloakid);
    return user;
  }

  @Post('update-profile')
  @CatchError()
  public async update(@Body() practitioner: PractitionerRegisterDto) {
    const keycloakid = await this.keycloak.createUserAndAssignRole(
      new KeycloakCreateDto(practitioner),
      RolesTypes.PRACTITIONER,
    );

    const user = await this.service.create(practitioner, keycloakid);
    return user;
  }
}
