import { IsArray, ValidateNested } from 'class-validator';
import { UpdateBasicDataDto } from './UpdateBasicData.dto';
import { Type } from 'class-transformer';
import { PractitionerQualificationDto } from './UpdateQualifications.dto';
import { UpdateProfile } from '../../practitioner.types';
import { HasRankOne } from '../../../decorators/fhir/HasRankOneTelecom';
import { UpdateIdentifierDto } from './UpdateIdentifier.dto';
import { ApiProperty } from '@nestjs/swagger';
import { CreateTelecomDto } from '../../../dto/fhir/Telecom.dto';
import { IsString, IsOptional, IsEmail } from 'class-validator';

export class UpdateProfileDto implements UpdateProfile {
  @ApiProperty({
    description: 'ID del profesional',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    required: true,
  })
  @IsString()
  readonly id: string;

  @ApiProperty({
    description: 'Email del profesional',
    example: 'john.doe@example.com',
    required: true,
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ type: UpdateBasicDataDto, description: 'Datos básicos del perfil del profesional', required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateBasicDataDto)
  readonly profile?: UpdateBasicDataDto;

  @ApiProperty({ type: [CreateTelecomDto], description: 'Información de contacto del profesional', required: false })
  @ValidateNested({ each: true })
  @Type(() => CreateTelecomDto)
  @HasRankOne({ message: 'Se requiere que al menos un telecom tenga rank 1' })
  readonly telecom?: CreateTelecomDto[];

  @ApiProperty({
    type: [PractitionerQualificationDto],
    description: 'Cualificaciones del profesional',
    required: false,
  })
  @ValidateNested()
  @Type(() => PractitionerQualificationDto)
  readonly qualifications?: PractitionerQualificationDto[];

  @ApiProperty({ type: [UpdateIdentifierDto], description: 'Identificadores del profesional', required: false })
  @ValidateNested()
  @Type(() => UpdateIdentifierDto)
  readonly identifiers?: UpdateIdentifierDto[];
}
