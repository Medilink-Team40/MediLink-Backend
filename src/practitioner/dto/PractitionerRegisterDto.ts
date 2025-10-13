import {
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UserBaseCreation } from 'src/types/user.types';
import { FHIRExternalGender } from '../practitioner.types';
import { Type } from 'class-transformer';
import { NameStructDto } from './NameStruct.dto';
import { PractitionerTelecomDto } from './Telecom.dto';
import { EqualsTo } from 'src/decorators/equals-to.decorator';

export class PractitionerRegisterDto implements UserBaseCreation {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @EqualsTo('password')
  repeatpassword: string;

  @IsDateString()
  @IsNotEmpty()
  birthDate: Date;

  @IsEnum(FHIRExternalGender)
  @IsNotEmpty()
  gender: FHIRExternalGender;

  @ValidateNested()
  @Type(() => NameStructDto)
  name: NameStructDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PractitionerTelecomDto)
  telecom: PractitionerTelecomDto[];
}
