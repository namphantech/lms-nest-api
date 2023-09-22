import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { ProductVariantType } from './../common/constants';
import { VariantOption } from './variant-options.entity';
@Entity('variant')
export class ProductVariant {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('enum', {
    enum: ProductVariantType,
    nullable: false,
  })
  type: ProductVariantType;
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

  @OneToMany(() => VariantOption, (variantOption) => variantOption.variant)
  variantOptions: VariantOption[];
}
