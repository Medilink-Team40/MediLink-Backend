import { IsArray, ValidateNested } from 'class-validator';
import { UpdateBasicDataDto } from './UpdateBasicData.dto';
import { Type } from 'class-transformer';
import { PractitionerQualificationDto } from './UpdateQualifications.dto';
import { UpdateProfile } from '../../practitioner.types';
import { HasRankOne } from '../../../decorators/fhir/HasRankOneTelecom';
import { UpdateIdentifierDto } from './UpdateIdentifier.dto';
import { ApiProperty } from '@nestjs/swagger';
import { CreateTelecomDto } from '../../../dto/fhir/Telecom.dto';

export class UpdateProfileDto implements UpdateProfile {
  @ApiProperty({ type: UpdateBasicDataDto, description: 'Datos básicos del perfil del profesional', required: false })
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
