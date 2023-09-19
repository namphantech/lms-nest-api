import { Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;
}
