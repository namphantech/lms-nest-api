import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity('caches')
@Unique(['key'])
export class MyCache {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'character varying' })
  key: string;

  @Column({ type: 'text' })
  value: string;

  @Column({ nullable: true })
  ttl: number;

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
