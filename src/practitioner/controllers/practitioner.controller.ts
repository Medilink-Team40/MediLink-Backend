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
    console.log(
      'To keycloak:',
      new KeycloakCreateDto(practitioner, RolesTypes.PRACTITIONER),
    );

    this.service.create(practitioner);

    return 'chetox';
  }
}
