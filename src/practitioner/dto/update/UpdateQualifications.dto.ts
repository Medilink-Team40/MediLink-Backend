import { IsDateString, IsOptional, IsNotEmpty, IsString } from 'class-validator';

export class PractitionerQualificationDto {
  @IsNotEmpty()
  @IsString()
  readonly practitionerId: string;

  @IsNotEmpty()
  @IsString()
  readonly code: string;

  @IsDateString()
  readonly periodStart: Date;

  @IsOptional()
  @IsDateString()
  readonly periodEnd: Date;
}
