import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { NameStruct } from '../../types/fhir.types';

export class NameStructDto implements NameStruct {
  @ApiProperty({ example: 'official', description: 'Uso del nombre (e.g., official, usual)' })
  @IsNotEmpty()
  @IsString()
  use: string;

  @ApiProperty({ example: 'Dr. John Doe', description: 'Nombre completo en formato de texto' })
  @IsNotEmpty()
  @IsString()
  text: string;

  @ApiProperty({ example: 'Doe', description: 'Apellido del profesional' })
  @IsNotEmpty()
  @IsString()
  family: string;

  @ApiProperty({ example: ['John', 'A.'], description: 'Nombres de pila del profesional' })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  given: string[];
}
