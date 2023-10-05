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
import { ApiProperty } from '@nestjs/swagger';
@Entity('variant')
export class ProductVariant {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column('enum', {
    enum: ProductVariantType,
    nullable: false,
    unique: true,
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

  @ApiProperty({
    type: [VariantOption],
  })
  @OneToMany(() => VariantOption, (variantOption) => variantOption.variant)
  variantOptions: VariantOption[];
}
