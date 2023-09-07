import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './index';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  @Column('varchar', { name: 'code', length: 255 })
  code: string;

  @Column('boolean', {
    name: 'is_deleted',
    nullable: false,
    default: false,
  })
  isDeleted: boolean;

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
