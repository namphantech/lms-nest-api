import { Controller } from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { Product } from './../entities';

@Crud({
  model: {
    type: Product,
  },
  routes: {
    only: [
      'getOneBase',
      'getManyBase',
      'createOneBase',
      'updateOneBase',
      'deleteOneBase',
    ],
  },
})
@Controller('api/product')
@ApiTags('product')
export class CrudProductController implements CrudController<Product> {
  constructor(public readonly service: ProductService) {}
  get base(): CrudController<Product> {
    return this;
  }
}
