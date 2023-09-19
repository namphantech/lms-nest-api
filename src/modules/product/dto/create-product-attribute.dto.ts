import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ProductAttribute } from 'modules/common/constants';

export class createProductAttributeDto {
  @ApiProperty({ example: 'COLOR' })
  @IsNotEmpty()
  @IsEnum(ProductAttribute, { each: true })
  type: ProductAttribute;
}
