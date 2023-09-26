import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../entities/role.entity';
import { User } from '../entities/user.entity';
import { CrudUserController } from './user.controller';
import { UsersService } from './user.service';
import { CachingModule } from './../caching/caching.module';

@Module({
  imports: [
    CachingModule,
    TypeOrmModule.forFeature([User, Role]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  exports: [UsersService],
  providers: [UsersService],
  controllers: [CrudUserController],
})
export class UserModule {}
