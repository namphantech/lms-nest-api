import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Unique } from 'modules/common/validator';

export class CreateCategoryDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: [{ id: 10 }, { id: 5 }] })
  @IsOptional()
  @IsArray()
  @ValidateNested({
    each: true,
  })
  products?: any[];
}
