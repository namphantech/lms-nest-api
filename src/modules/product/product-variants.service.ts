import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { ProductVariant } from 'modules/entities/product-variants.enity';

import { Repository } from 'typeorm';
import { createProductVaraintDto } from './dto/create-product-variant.dto';
import { User } from 'modules/entities';
import { VariantOption } from 'modules/entities/variant-options.entity';
import { CreateProductVariantOptionDto } from './dto/create-product-variant-option.dto';

@Injectable()
export class ProductVariantService extends TypeOrmCrudService<ProductVariant> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ProductVariant)
    private readonly productVariantRepository: Repository<ProductVariant>,
    @InjectRepository(VariantOption)
    private readonly variantOption: Repository<VariantOption>,
  ) {
    super(productVariantRepository);
  }
  public async createProductVariant(dto: createProductVaraintDto) {
    return await this.productVariantRepository.save(dto);
  }

  public async createVariantOption(dto: Partial<VariantOption>) {
    return await this.variantOption.save(dto);
  }
}
