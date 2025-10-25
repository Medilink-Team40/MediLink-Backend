import { Body, Controller, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { RolesTypes } from '@app/auth/auth.types';
import { KeyCloakService } from '@app/keycloak/services/create/create.service';
import { PractitionerRegisterDto } from '../dto/PractitionerRegisterDto';
import { CatchError } from '@app/decorators/errors.decorator';
import { KeycloakCreateDto } from '@app/keycloak/dto/KeycloakDto';
import { PractitionerService } from '../service/practitioner/practitioner.service';
import { Roles } from '@app/auth/roles/roles.decorator';
import { UpdateProfileDto } from '../dto/update/UpdateProfile.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '@app/auth/roles/roles.guard';
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
    return user;
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RolesTypes.PRACTITIONER, RolesTypes.ADMIN)
  @Patch('update-profile')
  @CatchError()
  public async update(@Request() req, @Body() practitioner: UpdateProfileDto) {
    const id = req.user.id as string;
    const email = req.user.email as string;

    await this.service.update({ ...practitioner, userId: id, email });
    return 'Profile updated successfully';
  }
}
