import { IsArray, ValidateNested } from 'class-validator';
import { UpdateBasicDataDto } from './UpdateBasicData.dto';
import { Type } from 'class-transformer';
import { PractitionerTelecomDto } from '../Telecom.dto';
import { PractitionerQualificationDto } from './UpdateQualifications.dto';
import { UpdateProfile } from '../../practitioner.types';
import { HasRankOne } from '../../decorators/class-validator/HasRankOneTelecom';
import { UpdateIdentifierDto } from './UpdateIdentifier.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto implements UpdateProfile {
  @ApiProperty({ type: UpdateBasicDataDto, description: 'Datos básicos del perfil del profesional', required: false })
  @ValidateNested()
  @Type(() => UpdateBasicDataDto)
  readonly profile?: UpdateBasicDataDto;

  @ApiProperty({ type: [PractitionerTelecomDto], description: 'Información de contacto del profesional', required: false })
  @ValidateNested({ each: true })
  @Type(() => PractitionerTelecomDto)
  @HasRankOne({ message: 'Se requiere que al menos un telecom tenga rank 1' })
  readonly telecom?: PractitionerTelecomDto[];

  @ApiProperty({ type: [PractitionerQualificationDto], description: 'Cualificaciones del profesional', required: false })
  @ValidateNested()
  @Type(() => PractitionerQualificationDto)
  readonly qualifications?: PractitionerQualificationDto[];

  @ApiProperty({ type: [UpdateIdentifierDto], description: 'Identificadores del profesional', required: false })
  @ValidateNested()
  @Type(() => UpdateIdentifierDto)
  readonly identifiers?: UpdateIdentifierDto[];
}
