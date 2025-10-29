import {  ValidateNested } from 'class-validator';
import { UpdateBasicDataDto } from './UpdateBasicData.dto';
import { Type } from 'class-transformer';
import { PractitionerQualificationDto } from '../../practitioner/dto/UpdateQualifications.dto';
import { HasRankOne } from '../../decorators/fhir/HasRankOneTelecom';
import { UpdateIdentifierDto } from './UpdateIdentifier.dto';
import { ApiProperty } from '@nestjs/swagger';
import { CreateTelecomDto } from './Telecom.dto';
import { UpdatePerson } from '../../types/person.types';

export class UpdateProfileDto implements UpdatePerson {
  @ApiProperty({ type: UpdateBasicDataDto, description: 'Datos básicos del perfil del profesional', required: false })
  @ValidateNested()
  @Type(() => UpdateBasicDataDto)
  readonly profile?: UpdateBasicDataDto;

  @ApiProperty({ type: [CreateTelecomDto], description: 'Información de contacto del profesional', required: false })
  @ValidateNested({ each: true })
  @Type(() => CreateTelecomDto)
  @HasRankOne({ message: 'Se requiere que al menos un telecom tenga rank 1' })
  readonly telecom?: CreateTelecomDto[];

  @ApiProperty({ type: [UpdateIdentifierDto], description: 'Identificadores del profesional', required: false })
  @ValidateNested()
  @Type(() => UpdateIdentifierDto)
  readonly identifiers?: UpdateIdentifierDto[];
}
