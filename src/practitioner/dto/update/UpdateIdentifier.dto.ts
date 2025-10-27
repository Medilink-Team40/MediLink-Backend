import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { PractitionerIdentifierType } from '../../practitioner.types';
import { ApiProperty } from '@nestjs/swagger';
import { FHIRIdentifierUse } from '../../../types/fhir.types';

export class UpdateIdentifierDto {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    description: 'ID del identificador (opcional para creación)',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty({
    enum: FHIRIdentifierUse,
    example: FHIRIdentifierUse.OFFICIAL,
    description: 'Uso del identificador (e.g., official, usual)',
  })
  @IsNotEmpty()
  @IsEnum(FHIRIdentifierUse)
  use: FHIRIdentifierUse;

  @ApiProperty({
    enum: PractitionerIdentifierType,
    example: PractitionerIdentifierType.NI,
    description: 'Tipo de identificador (e.g., NI, PRO, ESP)',
    required: false,
  })
  @IsOptional()
  @IsEnum(PractitionerIdentifierType)
  code?: PractitionerIdentifierType;

  @ApiProperty({ example: 'http://example.org/sid', description: 'Sistema de identificación' })
  @IsNotEmpty()
  @IsString()
  system: string;

  @ApiProperty({ example: '12345', description: 'Valor del identificador' })
  @IsNotEmpty()
  @IsString()
  value: string;
}
