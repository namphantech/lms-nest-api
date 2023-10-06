import { Column, CreateDateColumn, ManyToMany, UpdateDateColumn } from 'typeorm';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, ValidateNested } from 'class-validator';
import { Category } from 'modules/entities';

export class createProductDto {
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

  @ApiProperty()
  @Column({
    default: null,
  })
  quantity: number;

  @ApiProperty()
  @IsOptional()
  public image: string[];

  @ApiProperty({ example: [{ id: 1 }] })
  @ApiPropertyOptional()
  @ManyToMany(() => Category, (category) => category.products)
  category: Category[];

}
