import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Product, User } from './../entities';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinTable,
  ManyToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('category')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column('character varying', {
    length: 255,
  })
  name: string;

  @ManyToOne(() => User, (user) => user.id, {
    nullable: true,
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @ApiProperty()
  @ApiPropertyOptional()
  @ManyToMany(() => Product, (product) => product.category, { cascade: true })
  @JoinTable({ name: 'category_product' })
  products: Product[];
}
