import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Category } from './category.entity';
import { Wishlist } from './wishlist.entity';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column('character varying')
  name: string;

  @ApiProperty()
  @Column('text')
  description: string;

  @ApiProperty()
  @Column('numeric', {
    nullable: false,
    precision: 11,
    scale: 2,
    default: null,
  })
  price: number;

  @Column({
    default: null,
  })
  quantity: number;

  @Column('jsonb', { name: 'image_url', nullable: true })
  public image: string[];

  @ApiProperty()
  @ApiPropertyOptional()
  @ManyToMany(() => Category, (category) => category.products)
  category: Category[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.product)
  wishlist: Wishlist[];

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt: Date;
}
