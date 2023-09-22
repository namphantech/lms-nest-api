import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { ProductVariant } from './product-variants.enity';
@Entity('variant_option')
export class VariantOption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('character varying')
  value: string;

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

  @VersionColumn() revision: number;

  @ManyToOne(() => ProductVariant, (variant) => variant.variantOptions)
  @JoinColumn({ name: 'variant_id' })
  variant: ProductVariant;
}
