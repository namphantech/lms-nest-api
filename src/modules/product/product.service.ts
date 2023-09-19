import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { ProductAttributes } from 'modules/entities/product-attributes.enity';
import { Product } from 'modules/entities/product.entity';
import { Repository } from 'typeorm';
import { createProductAttributeDto } from './dto/create-product-attribute.dto';

@Injectable()
export class ProductService extends TypeOrmCrudService<Product> {
  constructor(
    @InjectRepository(Product)
    private readonly userRepository: Repository<Product>,
    @InjectRepository(ProductAttributes)
    private readonly productAttriRepository: Repository<ProductAttributes>,
  ) {
    super(userRepository);
  }
  public async createProductAttribute(dto: createProductAttributeDto) {
    return await this.productAttriRepository.save(dto);
  }
}
