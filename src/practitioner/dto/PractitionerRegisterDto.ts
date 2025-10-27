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
import { UserBaseCreation } from '../../types/user.types';
import { FHIRExternalGender } from '../practitioner.types';
import { Type } from 'class-transformer';
import { NameStructDto } from './NameStruct.dto';
import { PractitionerTelecomDto } from './Telecom.dto';
import { EqualsTo } from '../../decorators/equals-to.decorator';
import { HasRankOne } from '../decorators/class-validator/HasRankOneTelecom';
import { NoDuplicateEmailInTelecom } from '../decorators/class-validator/NoDuplicateEmailInTelecom';
import { ApiProperty } from '@nestjs/swagger';

export class PractitionerRegisterDto implements UserBaseCreation {
  @ApiProperty({ example: 'john.doe@example.com', description: 'Email del profesional' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'SecurePassword123', description: 'Contraseña del profesional' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'SecurePassword123', description: 'Repetición de la contraseña' })
  @EqualsTo('password')
  repeatpassword: string;

  @ApiProperty({ example: '1980-01-15', description: 'Fecha de nacimiento del profesional (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  birthDate: Date;

  @ApiProperty({ enum: FHIRExternalGender, example: FHIRExternalGender.MALE, description: 'Género del profesional' })
  @IsEnum(FHIRExternalGender)
  @IsNotEmpty()
  gender: FHIRExternalGender;

  @ApiProperty({ type: [NameStructDto], description: 'Nombres del profesional' })
  @IsArray()
  @ValidateNested()
  @Type(() => NameStructDto)
  name: NameStructDto[];

  @ApiProperty({
    type: [PractitionerTelecomDto],
    description: 'Información de contacto del profesional',
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PractitionerTelecomDto)
  @HasRankOne({ message: 'Se requiere que al menos un telecom tenga rank 1' })
  @NoDuplicateEmailInTelecom()
  telecom?: PractitionerTelecomDto[];
}
