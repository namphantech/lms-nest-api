// import {
//   Column,
//   Entity,
//   PrimaryGeneratedColumn,
//   CreateDateColumn,
//   DeleteDateColumn,
//   ManyToOne,
//   JoinColumn,
//   OneToMany,
// } from 'typeorm';
// //import { Cart } from './cart.entity';
// import { CartItem } from './cart_item.entity';
// import { Category } from './category.entity';

// @Entity('product')
// export class Product {
//   @Column({ name: 'id', type: 'bigint' })
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ name: 'name', nullable: false })
//   productName: string;

//   @Column({ name: 'files', type: 'json', nullable: false })
//   productFiles: Record<string, any>;

//   @Column({ name: 'description', default: '' })
//   productDescription: string;

//   @Column({ name: 'price', nullable: true, type: 'numeric' })
//   productPrice: number;

//   @Column({ name: 'amount', nullable: false })
//   productAmount: number;

//   @Column({ name: 'discount', default: 0 })
//   productDiscount: number;

//   // @Column({ name: 'type', nullable: false })
//   // productType: string;

//   @ManyToOne(() => Category, (category) => category.products)
//   @JoinColumn({ name: 'categoryByProduct', referencedColumnName: 'id' })
//   category: Category;

//   @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
//   CreatedAt: Date;

//   @CreateDateColumn({ name: 'updated_at', type: 'timestamp' })
//   UpdatedAt: Date;

//   @DeleteDateColumn({ name: 'deleted_at', nullable: true })
//   DeletedAt?: Date;

//   @OneToMany(() => CartItem, (productwithCart) => productwithCart.product)
//   productwithCart: CartItem[];
// }
