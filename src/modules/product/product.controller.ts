import { Controller } from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiTags } from '@nestjs/swagger';
import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import { Product } from './../entities';

import { createProductDto } from './dto/create-product.dto';
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
  query: {
    join: {
      category: {
        alias: 'category',
        eager: true,
      },
    },
  },
})
@Controller('api/product')
@ApiTags('product')
export class CrudProductController implements CrudController<Product> {
  constructor(public readonly service: ProductService) {}
  get base(): CrudController<Product> {
    return this;
  }

  @Override('createOneBase')
  async createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: createProductDto,
  ) {
    return this.base.createOneBase(req, dto as Product);
  }
}
