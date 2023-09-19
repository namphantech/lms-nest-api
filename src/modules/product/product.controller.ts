import { Body, Controller, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { createProductAttributeDto } from './dto/create-product-attribute.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('api/product')
@ApiTags('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('/product-attribute')
  async addProductAttribute(@Body() dto: createProductAttributeDto) {
    return await this.productService.createProductAttribute(dto);
  }
}
