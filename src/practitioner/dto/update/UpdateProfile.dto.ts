import { IsArray, ValidateNested } from 'class-validator';
import { UpdateBasicDataDto } from './UpdateBasicData.dto';
import { Type } from 'class-transformer';
import { PractitionerTelecomDto } from '../Telecom.dto';
import { PractitionerQualificationDto } from './UpdateQualifications.dto';
import { PractitionerIdentifier } from '../../entities';
import { UpdateProfile } from '../../practitioner.types';
import { HasRankOne } from '../../decorators/class-validator/HasRankOneTelecom';

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
