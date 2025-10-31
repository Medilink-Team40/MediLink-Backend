import { Body, Controller, Get, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { RolesTypes } from '../../auth/auth.types';
import { KeyCloakService } from '../../keycloak/services/create/create.service';
import { PractitionerRegisterDto } from '../dto/PractitionerRegisterDto';
import { CatchError } from '../../decorators/errors.decorator';
import { KeycloakCreateDto } from '../../keycloak/dto/KeycloakDto';
import { PractitionerService } from '../service/practitioner/practitioner.service';
// import { Roles } from '../../auth/roles/roles.decorator';
import { UpdateProfileDto } from '../dto/update/UpdateProfile.dto';
// import { AuthGuard } from '@nestjs/passport';
// import { RolesGuard } from '../../auth/roles/roles.guard';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FHIRExternalGender, FHIRTelecomSystem, TelecomUses, FHIRIdentifierUse } from '../../types/fhir.types';
import { PractitionerIdentifierType } from '../practitioner.types';
import { UserData } from '../../auth/auth.types';

@ApiTags('Practitioner')
@Controller('practitioner')
// @UseGuards(AuthGuard('jwt'), RolesGuard)
export class PractitionerController {
  constructor(
    private readonly keycloak: KeyCloakService,
    private readonly service: PractitionerService,
  ) {}

  // @Roles(RolesTypes.ADMIN)
  @Post('register-practitioner')
  @ApiOperation({
    summary: 'Registrar un nuevo profesional',
    description: 'Registra un nuevo profesional en el sistema y Keycloak.',
  })
  @ApiBody({
    type: PractitionerRegisterDto,
    examples: {
      a: {
        summary: 'Ejemplo de registro de profesional',
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
  @ApiResponse({ status: 201, description: 'Profesional registrado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos de registro inválidos.' })
  @CatchError()
  public async create(@Body() practitioner: PractitionerRegisterDto) {
    const keycloakid = await this.keycloak.createUserAndAssignRole(
      new KeycloakCreateDto(practitioner),
      RolesTypes.PRACTITIONER,
    );

    const user = await this.service.create(practitioner, keycloakid);
    return user;
  }

  // @Roles(RolesTypes.PRACTITIONER, RolesTypes.ADMIN)
  @Get('me')
  @ApiOperation({
    summary: 'Obtener perfil del profesional actual',
    description: 'Retorna los datos del profesional autenticado.',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil del profesional obtenido exitosamente.',
    schema: {
      example: {
        keycloakId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
        active: true,
        gender: FHIRExternalGender.MALE,
        email: 'john.doe@example.com',
        role: RolesTypes.PRACTITIONER,
        birthDate: '1980-01-15',
        name: [
          {
            use: 'official',
            text: 'Dr. John Doe',
            family: 'Doe',
            given: ['John', 'A.'],
          },
        ],
        createdAt: '2025-10-26T11:00:00.000Z',
        identifier: [
          {
            id: 'uuid-of-identifier-1',
            use: FHIRIdentifierUse.OFFICIAL,
            system: 'http://example.org/sid',
            value: '12345',
          },
        ],
        telecom: [
          {
            id: 'uuid-of-telecom-1',
            system: FHIRTelecomSystem.PHONE,
            value: '+1234567890',
            use: TelecomUses.WORK,
            rank: 1,
          },
        ],
        qualification: [
          {
            id: 'uuid-of-qualification-1',
            practitionerId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
            code: 'MD',
            periodStart: '2005-06-01',
            periodEnd: '2025-06-01',
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Profesional no encontrado.' })
  @CatchError()
  public async getCurrentPractitioner(@Request() req: { user: UserData }) {
    const keycloakId = req.user.id;
    const practitioner = await this.service.findOne(keycloakId);
    return practitioner;
  }

  // @Roles(RolesTypes.PRACTITIONER, RolesTypes.ADMIN)
  @Patch('update-profile')
  @ApiOperation({
    summary: 'Actualizar perfil del profesional',
    description: 'Actualiza los datos básicos, telecomunicaciones, cualificaciones e identificadores del profesional.',
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
              value: '+1234567890',
              use: TelecomUses.WORK,
              rank: 1,
            },
          ],
          qualifications: [
            {
              practitionerId: 'keycloak-id-of-practitioner',
              code: 'MD',
              periodStart: '2005-06-01',
              periodEnd: '2025-06-01',
            },
          ],
          identifiers: [
            {
              use: FHIRIdentifierUse.OFFICIAL,
              code: PractitionerIdentifierType.NI,
              system: 'http://example.org/sid',
              value: '12345',
            },
          ],
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Perfil actualizado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos de actualización inválidos.' })
  @CatchError()
  public async update(@Request() req: { user: UserData }, @Body() practitioner: UpdateProfileDto) {
    const id = req.user.id;
    const email = req.user.email;

    await this.service.update({ ...practitioner, userId: id, email });
    return 'Profile updated successfully';
  }
}
