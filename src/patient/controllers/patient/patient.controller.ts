import { Body, Controller, Patch, Post, Request } from '@nestjs/common';
import { KeyCloakService } from '../../../keycloak/services/create/create.service';
import { KeycloakCreateDto } from '../../../keycloak/dto/KeycloakDto';
import { PatientRegisterDto } from '../../dto/PatientRegisterDto';
import { RolesTypes, UserData } from '../../../auth/auth.types';
import { PatientService } from '../../services/patient/patient.service';
import { CatchError } from '../../../decorators/errors.decorator';
import { UpdateProfileDto } from '../../../practitioner/dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FHIRExternalGender, FHIRIdentifierUse, FHIRTelecomSystem, TelecomUses } from '../../../types/fhir.types';

@Controller('patient')
export class PatientController {
  constructor(
    private readonly keycloak: KeyCloakService,
    private readonly service: PatientService,
  ) {}

  @ApiOperation({
    summary: 'Registrar un nuevo paciente',
    description: 'Registra un nuevo paciente en el sistema y Keycloak.',
  })
  @ApiBody({
    type: PatientRegisterDto,
    examples: {
      a: {
        summary: 'Ejemplo de registro de paciente',
        value: {
          email: 'john.doe@example.com',
          password: 'SecurePassword123',
          repeatpassword: 'SecurePassword123',
          birthDate: '1980-01-15',
          gender: FHIRExternalGender.MALE,
          name: [
            {
              use: 'official',
              text: 'Dr. John Doe',
              family: 'Doe',
              given: ['John', 'A.'],
            },
          ],
          telecom: [
            {
              system: FHIRTelecomSystem.PHONE,
              value: '+1234567890',
              use: TelecomUses.WORK,
              rank: 1,
            },
            {
              system: FHIRTelecomSystem.EMAIL,
              value: 'john.doe@example.com',
              use: TelecomUses.WORK,
              rank: 2,
            },
          ],
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'paciente registrado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos de registro inválidos.' })
  @Post('register')
  @CatchError()
  public async create(@Body() patient: PatientRegisterDto) {
    const keycloakid = await this.keycloak.createUserAndAssignRole(new KeycloakCreateDto(patient), RolesTypes.PATIENT);

    const user = await this.service.create(patient, keycloakid);
    return user;
  }

  @ApiOperation({
    summary: 'Actualizar perfil del paciente',
    description: 'Actualiza los datos básicos, telecomunicaciones, cualificaciones e identificadores del paciente.',
  })
  @ApiBody({
    type: UpdateProfileDto,
    examples: {
      a: {
        summary: 'Ejemplo de actualización de perfil',
        value: {
          profile: {
            name: [
              {
                use: 'official',
                text: 'Dr. John A. Doe',
                family: 'Doe',
                given: ['John', 'A.'],
              },
            ],
            birthDate: '1980-01-15',
            gender: FHIRExternalGender.MALE,
            active: true,
          },
          telecom: [
            {
              system: FHIRTelecomSystem.PHONE,
              value: '1234567890',
              use: TelecomUses.WORK,
              rank: 1,
            },
          ],
          identifiers: [
            {
              use: FHIRIdentifierUse.OFFICIAL,
              code: 'string',
              system: 'http://example.org/sid',
              value: '12345',
            },
          ],
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 400, description: 'Datos de actualización inválidos.' })
  @Patch('update-profile')
  @CatchError()
  public async update(@Request() req: { user: UserData }, @Body() person: UpdateProfileDto) {
    const id = req.user.id;
    const email = req.user.email;

    await this.service.update({ ...person, userId: id, email });
    return 'Profile updated successfully';
  }
}
