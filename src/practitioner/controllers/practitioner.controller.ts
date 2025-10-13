import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesTypes } from 'src/auth/auth.types';
import { Roles } from 'src/auth/roles/roles.decorator';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { CreateService } from 'src/keycloak/services/create/create.service';
import { PractitionerRegisterDto } from '../dto/PractitionerRegisterDto';
import { CatchError } from 'src/decorators/errors.decorator';
import { KeycloakCreateDto } from 'src/keycloak/dto/KeycloakDto';

@Controller('practitioner')
export class PractitionerController {
  constructor(private keycloak: CreateService) {}

  //@UseGuards(AuthGuard(), RolesGuard)
  //@Roles(RolesTypes.ADMIN)
  @Post('register-practitioner')
  @CatchError()
  public async create(@Body() practitioner: PractitionerRegisterDto) {
    console.log(
      'To keycloak:',
      new KeycloakCreateDto(practitioner, RolesTypes.PRACTITIONER),
    );

    return 'chetox';
  }
}
