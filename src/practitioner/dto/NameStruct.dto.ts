import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';
import { NameStruct } from '../practitioner.types';

export class NameStructDto implements NameStruct {
  @IsNotEmpty()
  @IsString()
  use: string;

  @IsNotEmpty()
  @IsString()
  text: string;

  @IsNotEmpty()
  @IsString()
  family: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  given: string[];
}
