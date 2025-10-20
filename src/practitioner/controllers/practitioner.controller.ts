import { Body, Controller, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { RolesTypes } from 'src/auth/auth.types';
import { KeyCloakService } from 'src/keycloak/services/create/create.service';
import { PractitionerRegisterDto } from '../dto/PractitionerRegisterDto';
import { CatchError } from 'src/decorators/errors.decorator';
import { KeycloakCreateDto } from 'src/keycloak/dto/KeycloakDto';
import { PractitionerService } from '../service/practitioner/practitioner.service';
import { Roles } from 'src/auth/roles/roles.decorator';
import { UpdateProfileDto } from '../dto/update/UpdateProfile.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { AccountOwnerGuard } from '../guards/account-owner/account-owner.guard';

@Controller('practitioner')
export class PractitionerController {
  constructor(
    private readonly keycloak: KeyCloakService,
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
    //await this.keycloak.setCustomAttribute<typeof user.id>(keycloakid, 'database_id', user.id);
    return user;
  }

  //@UseGuards(AuthGuard(), RolesGuard, AccountOwnerGuard)
  //@Roles(RolesTypes.PRACTITIONER)
  @Patch('update-profile/:keycloakId')
  @CatchError()
  public async update(@Param('keycloakId') id: string, @Body() practitioner: UpdateProfileDto) {
    return 'nenazo';
  }
}
