import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ProductVariantType } from 'modules/common/constants';


export class createProductVaraintDto {
  @ApiProperty({ example: 'COLOR' })
  @IsNotEmpty()
  @IsEnum(ProductVariantType, { each: true })
  type: ProductVariantType;
}
