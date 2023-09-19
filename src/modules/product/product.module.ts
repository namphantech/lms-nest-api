import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductAttributes } from 'modules/entities/product-attributes.enity';
import { Product } from 'modules/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductAttributes])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
