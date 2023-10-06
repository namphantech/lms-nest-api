import { Module } from '@nestjs/common';
import { CrudProductController } from './product.controller';
import { ProductService } from './index';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductVariant } from './../entities/product-variants.enity';
import { Product } from './../entities/product.entity';
import { User } from './../entities';
import { ProductVariantController } from './product-variants.controller';
import { ProductVariantService } from './product-variants.service';
import { PassportModule } from '@nestjs/passport';
import { VariantOption } from 'modules/entities/variant-options.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductVariant, User, VariantOption]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [CrudProductController, ProductVariantController],
  providers: [ProductService, ProductVariantService],
  exports: [ProductService, ProductVariantService],
})
export class ProductModule {}
