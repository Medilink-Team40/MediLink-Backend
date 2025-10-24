import {
  ArrayMaxSize,
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
import { HasRankOne } from '../decorators/class-validator/HasRankOneTelecom';
import { NoDuplicateEmailInTelecom } from '../decorators/class-validator/NoDuplicateEmailInTelecom';

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

  @IsArray()
  @ValidateNested()
  @Type(() => NameStructDto)
  name: NameStructDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PractitionerTelecomDto)
  @HasRankOne({ message: 'Se requiere que al menos un telecom tenga rank 1' })
  @NoDuplicateEmailInTelecom()
  telecom?: PractitionerTelecomDto[];
}
