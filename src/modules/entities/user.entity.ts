import {
  AfterLoad,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { UserStatus } from '../common/constants';
import { Role } from './role.entity';
import { PasswordTransformer } from './password.transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'email', nullable: false, unique: true })
  @Index()
  email: string;

  @Column('character varying', {
    name: 'first_name',
    nullable: true,
    length: 128,
  })
  firstName: string;

  @Column('character varying', {
    name: 'last_name',
    nullable: true,
    length: 128,
  })
  lastName: string;

  @Column('character varying', {
    name: 'phone_number',
    nullable: true,
    length: 32,
  })
  phoneNumber: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Column({
    // type: 'character varying',
    transformer: new PasswordTransformer(),
    nullable: true,
  })
  password: string;

  @Column({
    name: 'reset_password_token',
    length: 255,
    nullable: true,
  })
  resetPasswordToken: string;

  @Column({
    name: 'reset_password_token_expire',
    length: 255,
    nullable: true,
  })
  resetPasswordTokenExpire: string;

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

  @ManyToOne(() => User, (user) => user.id, {
    nullable: true,
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @ManyToOne(() => Role, (roles) => roles.id)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column({ name: 'role_id' })
  roleId: number;

  toJSON() {
    const { ...self } = this;
    return self;
  }
  fullName: string;

  @AfterLoad()
  setComputed() {
    this.fullName = this.firstName + ' ' + this.lastName;
  }
}
