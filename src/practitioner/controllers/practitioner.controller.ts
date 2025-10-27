import { Body, Controller, Get, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { RolesTypes } from '../../auth/auth.types';
import { KeyCloakService } from '../../keycloak/services/create/create.service';
import { PractitionerRegisterDto } from '../dto/PractitionerRegisterDto';
import { CatchError } from '../../decorators/errors.decorator';
import { KeycloakCreateDto } from '../../keycloak/dto/KeycloakDto';
import { PractitionerService } from '../service/practitioner/practitioner.service';
import { Roles } from '../../auth/roles/roles.decorator';
import { UpdateProfileDto } from '../dto/update/UpdateProfile.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../auth/roles/roles.guard';
import { AccountOwnerGuard } from '../guards/account-owner/account-owner.guard';

@Controller('practitioner')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class PractitionerController {
  constructor(
    private readonly keycloak: KeyCloakService,
    private readonly service: PractitionerService,
  ) {}

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

  @Roles(RolesTypes.PRACTITIONER, RolesTypes.ADMIN)
  @Get('me')
  @CatchError()
  public async getCurrentPractitioner(@Request() req) {
    const keycloakId = req.user.id as string;
    const practitioner = await this.service.findOne(keycloakId);
    return practitioner;
  }

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
