import { Type } from 'class-transformer';
import { IsBoolean, IsDateString, IsEnum, IsNotEmpty, ValidateNested } from 'class-validator';
import { NameStructDto } from '../NameStruct.dto';
import { FHIRExternalGender } from '../../practitioner.types';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBasicDataDto {
  @ApiProperty({ type: [NameStructDto], description: 'Nombres del profesional', required: false })
  @ValidateNested()
  @Type(() => NameStructDto)
  name?: NameStructDto[];

  @ApiProperty({ example: '1980-01-15', description: 'Fecha de nacimiento del profesional (YYYY-MM-DD)', required: false })
  @IsDateString()
  @IsNotEmpty()
  birthDate?: Date;

  @ApiProperty({ enum: FHIRExternalGender, example: FHIRExternalGender.MALE, description: 'Género del profesional', required: false })
  @IsEnum(FHIRExternalGender)
  @IsNotEmpty()
  gender?: FHIRExternalGender;

  @ApiProperty({ example: true, description: 'Estado de actividad del profesional', required: false })
  @IsBoolean()
  active?: boolean;
}
