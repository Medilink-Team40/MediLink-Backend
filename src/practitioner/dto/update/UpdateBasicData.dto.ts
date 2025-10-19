import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { NameStructDto } from '../NameStruct.dto';
import { FHIRExternalGender } from 'src/practitioner/practitioner.types';

export class UpdateBasicDataDto {
  @ValidateNested()
  @Type(() => NameStructDto)
  name: NameStructDto[];

  @IsDateString()
  @IsNotEmpty()
  birthDate: Date;

  @IsEnum(FHIRExternalGender)
  @IsNotEmpty()
  gender: FHIRExternalGender;
}
