import { Controller, Get } from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('api/product')
@ApiTags('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Get('helllo')
  async hello() {
    return 0;
  }
}
