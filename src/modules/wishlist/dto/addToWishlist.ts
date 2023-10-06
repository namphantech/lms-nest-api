import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AddToWishlistDto {
  @ApiProperty()
  @IsNotEmpty()
  productId: number;
}
