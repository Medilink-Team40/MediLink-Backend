import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { KeyCloakService } from '../../../keycloak/services/create/create.service';
import { KeycloakCreateDto } from '../../../keycloak/dto/KeycloakDto';
import { PatientRegisterDto } from '../../dto/PatientRegisterDto';
import { RolesTypes } from '../../../auth/auth.types';
import { PatientService } from '../../services/patient/patient.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from '../../../auth/roles/roles.decorator';
import { RolesGuard } from '../../../auth/roles/roles.guard';
import { Patient } from '../../entities/patient.entity';

@ApiTags('Patient')
@Controller('patient')
export class PatientController {
  constructor(
    private readonly keycloak: KeyCloakService,
    private readonly service: PatientService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(RolesTypes.ADMIN)
  @ApiOperation({ summary: 'Crear un nuevo paciente' })
  @ApiBody({ type: PatientRegisterDto, description: 'Datos del paciente a registrar' })
  @ApiCreatedResponse({
    description: 'El paciente ha sido creado exitosamente.',
    type: Patient,
  })
  @ApiUnauthorizedResponse({ description: 'No autorizado' })
  public async create(@Body() patient: PatientRegisterDto) {
    const keycloakid = await this.keycloak.createUserAndAssignRole(new KeycloakCreateDto(patient), RolesTypes.PATIENT);

    const user = await this.service.create(patient, keycloakid);
    return user;
  }
}
