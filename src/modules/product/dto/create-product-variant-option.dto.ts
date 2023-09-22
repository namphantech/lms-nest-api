import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateProductVariantOptionDto {
  @ApiProperty({ example: ['Medium', 'Large', 'Small'] })
  value: string[];

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  productVariantId: number;
}
