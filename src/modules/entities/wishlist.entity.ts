import { ApiProperty } from '@nestjs/swagger';
import { User } from './index';
import { Product } from './index';
import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  ManyToOne,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.wishlist, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @Column()
  @ApiProperty()
  @OneToOne(() => User, (user) => user.id)
  user: number;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;
}
