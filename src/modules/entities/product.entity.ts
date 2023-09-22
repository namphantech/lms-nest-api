import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductVariant } from './product-variants.enity';
@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('character varying')
  name: string;

  @Column('text')
  description: string;

  @ManyToMany(() => ProductVariant)
  @JoinTable({ name: 'product_variant' })
  productVariants: ProductVariant[];
}
