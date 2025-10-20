import { IsEmail, IsNotEmpty, ValidateNested } from 'class-validator';
import { UpdateBasicDataDto } from './UpdateBasicData.dto';
import { Type } from 'class-transformer';
import { PractitionerTelecomDto } from '../Telecom.dto';
import { PractitionerQualificationDto } from './UpdateQualifications.dto';
import { PractitionerIdentifier } from 'src/practitioner/entities';

export class UpdateProfileDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ValidateNested()
  @Type(() => UpdateBasicDataDto)
  readonly profile?: UpdateBasicDataDto;

  @ValidateNested()
  @Type(() => PractitionerTelecomDto)
  readonly telecom?: PractitionerTelecomDto[];

  @ValidateNested()
  @Type(() => PractitionerQualificationDto)
  readonly qualifications?: PractitionerQualificationDto[];

  @ValidateNested()
  @Type(() => PractitionerIdentifier)
  readonly identifiers?: PractitionerIdentifier[];
}
