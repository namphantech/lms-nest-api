import { Module } from '@nestjs/common';
import { CrudCategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { PassportModule } from '@nestjs/passport';
import { Category } from './../entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './../user';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UserModule,
  ],
  controllers: [CrudCategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
