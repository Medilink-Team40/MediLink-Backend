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
import { Type } from 'class-transformer';
import { EqualsTo } from '../../decorators/equals-to.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { FHIRExternalGender } from '../../types/fhir.types';
import { CreateTelecomDto, NameStructDto } from '../../practitioner/dto';
import { HasRankOne } from '../../decorators/fhir/HasRankOneTelecom';
import { NoDuplicateEmailInTelecom } from '../../decorators/fhir/NoDuplicateEmailInTelecom';

export class PatientRegisterDto implements UserBaseCreation {
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
    type: [CreateTelecomDto],
    description: 'Información de contacto del profesional',
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTelecomDto)
  @HasRankOne({ message: 'Se requiere que al menos un telecom tenga rank 1' })
  @NoDuplicateEmailInTelecom()
  telecom?: CreateTelecomDto[];
}
