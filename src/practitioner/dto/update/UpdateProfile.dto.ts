import { IsEmail, IsNotEmpty, ValidateNested } from 'class-validator';
import { UpdateBasicDataDto } from './UpdateBasicData.dto';
import { Type } from 'class-transformer';
import { PractitionerTelecomDto } from '../Telecom.dto';
import { PractitionerQualificationDto } from './UpdateQualifications.dto';

export class UpdateProfileDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ValidateNested()
  @Type(() => UpdateBasicDataDto)
  profile: UpdateBasicDataDto;

  @ValidateNested()
  @Type(() => PractitionerTelecomDto)
  telecom: PractitionerTelecomDto[];

  @ValidateNested()
  @Type(() => PractitionerQualificationDto)
  qualifications: PractitionerQualificationDto[];
}
