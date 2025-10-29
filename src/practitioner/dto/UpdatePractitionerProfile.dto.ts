import { PractitionerQualificationDto, UpdateProfileDto } from '../../person/dto';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePractitionerProfileDto extends UpdateProfileDto {
  @ApiProperty({
    type: [PractitionerQualificationDto],
    description: 'Cualificaciones del profesional',
    required: false,
  })
  @ValidateNested()
  @Type(() => PractitionerQualificationDto)
  readonly qualifications?: PractitionerQualificationDto[];
}
