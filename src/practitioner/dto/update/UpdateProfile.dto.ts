import { IsArray, IsEmail, IsNotEmpty, ValidateNested } from 'class-validator';
import { UpdateBasicDataDto } from './UpdateBasicData.dto';
import { Type } from 'class-transformer';
import { PractitionerTelecomDto } from '../Telecom.dto';
import { PractitionerQualificationDto } from './UpdateQualifications.dto';
import { PractitionerIdentifier } from 'src/practitioner/entities';
import { UpdateProfile } from 'src/practitioner/practitioner.types';
import { HasRankOne } from 'src/practitioner/decorators/class-validator/HasRankOneTelecom';

export class UpdateProfileDto implements UpdateProfile {
  @ValidateNested()
  @Type(() => UpdateBasicDataDto)
  readonly profile?: UpdateBasicDataDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PractitionerTelecomDto)
  @HasRankOne({ message: 'Se requiere que al menos un telecom tenga rank 1' })
  readonly telecom?: PractitionerTelecomDto[];

  @ValidateNested()
  @Type(() => PractitionerQualificationDto)
  readonly qualifications?: PractitionerQualificationDto[];

  @ValidateNested()
  @Type(() => PractitionerIdentifier)
  readonly identifiers?: PractitionerIdentifier[];
}
