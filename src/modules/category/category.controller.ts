import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import { Category, User } from './../entities';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryService } from './category.service';
import { AuthGuard } from '@nestjs/passport';
import { GetCurrentUser, RolesAllowed } from './../common/decorators';
import { Roles } from 'modules/common/constants';
import { RolesGuard } from 'modules/auth/role.guard';
@ApiBearerAuth()
@Crud({
  model: {
    type: Category,
  },
  routes: {
    only: [
      'createOneBase',
      'getManyBase',
      'getOneBase',
      'updateOneBase',
      'deleteOneBase',
    ],
    createOneBase: {
      decorators: [RolesAllowed(Roles.ADMIN)],
    },
  },

  dto: {
    create: CreateCategoryDto,
    update: CreateCategoryDto,
  },
  query: {
    join: {
      createdBy: {
        exclude: [
          'status',
          'resetPasswordToken',
          'resetPasswordTokenExpire',
          'roleId',
          'email',
          'phoneNumber',
          'password',
          'createdBy',
          'createdAt',
          'updatedAt',
          'revision',
        ],
        alias: 'createdBy',
        eager: true,
      },
    },
  },
})
@UseGuards(AuthGuard())
@ApiTags('category')
@Controller('api/category')
export class CrudCategoryController implements CrudController<Category> {
  constructor(public readonly service: CategoryService) {}
  get base(): CrudController<Category> {
    return this;
  }
  @UseGuards(RolesGuard)
  @Override('createOneBase')
  async createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateCategoryDto,
    @GetCurrentUser() user: User,
  ) {
    const createCategory: Partial<Category> = {
      ...dto,
      createdBy: user,
    };
    return this.base.createOneBase(req, createCategory as Category);
  }
}
