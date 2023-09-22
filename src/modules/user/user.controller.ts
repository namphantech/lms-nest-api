import {
  BadRequestException,
  Controller,
  HttpException,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  Crud,
  CrudController,
  CrudRequest,
  GetManyDefaultResponse,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
// import { GeneratePassword } from '../../utils/generatePassword';
import { Roles } from '../common/constants';
import { GetCurrentUser, RolesAllowed } from '../common/decorators';
import { User } from '../entities';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UsersService } from './user.service';
// import { AuthForgotPasswordDto } from '';
// import { UpdatePassword } from './dto/update-password.dto';
import { RolesGuard } from './../auth/role.guard';
// import { RolesGuard } from 'modules/auth/roles.guard';

@ApiBearerAuth()
@Crud({
  model: {
    type: User,
  },
  routes: {
    only: [
      'getOneBase',
      'getManyBase',
      'createOneBase',
      'updateOneBase',
      'deleteOneBase',
    ],
    createOneBase: {
      decorators: [RolesAllowed(Roles.ADMIN)],
    },
    updateOneBase: {
      decorators: [RolesAllowed(Roles.ADMIN)],
    },
    deleteOneBase: {
      decorators: [RolesAllowed(Roles.ADMIN)],
    },
  },
  dto: {
    create: CreateUserDto,
    update: UpdateUserDto,
  },
  query: {
    exclude: ['password'],
    join: {
      role: {
        exclude: ['createdAt', 'updatedAt', 'revision'],
        alias: 'role',
        eager: true,
      },
      createdBy: {
        exclude: [
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
@Controller('api/users')
@ApiTags('user')
@UseGuards(AuthGuard())
export class CrudUserController implements CrudController<User> {
  constructor(public readonly service: UsersService) {}
  get base(): CrudController<User> {
    return this;
  }
  @Override('createOneBase')
  @RolesAllowed(Roles.ADMIN)
  @UseGuards(RolesGuard)
  async createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateUserDto,
    @GetCurrentUser() user: User,
  ) {
    const checkEmailUser = await this.service.findOne({
      where: {
        email: dto.email,
      },
    });
    if (checkEmailUser && checkEmailUser.id) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          messageCode: 'auth.emailDuplicated',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const roleData = await this.service.findRole(dto.roleId);
    if (!roleData || !roleData.id) {
      throw new BadRequestException('Role not found');
    }
    const createUser: Partial<User> = {
      ...dto,
      password: dto.password,
      createdBy: user,
      role: roleData,
    };
    return this.base.createOneBase(req, createUser as User);
  }

  @Override('updateOneBase')
  async updateOne(
    @GetCurrentUser() user: User,
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: UpdateUserDto,
  ) {
    const roleData = await this.service.findRole(dto.roleId);
    if (!roleData || !roleData.id) {
      throw new BadRequestException('Role not found');
    }
    const createUser: Partial<User> = {
      ...dto,
      role: roleData,
    };
    return this.base.updateOneBase(req, createUser as User);
  }

  @Override('getManyBase')
  @RolesAllowed(Roles.ADMIN)
  @UseGuards(RolesGuard)
  @ApiQuery({ name: 'search', type: 'string', required: false })
  async getMany(@ParsedRequest() req: CrudRequest, @Query() query) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    req.query = query;
    const users = (await this.base.getManyBase(
      req,
    )) as GetManyDefaultResponse<User>;
    return users;
  }

  // @UseGuards(RolesGuard)
  // @RolesAllowed(Roles.ADMIN)
  // @Post('reset-password')
  // async resetPassword(@Body() resetPasswordDto: AuthForgotPasswordDto) {
  //   return await this.service.resetPasswordByAdmin(resetPasswordDto.email);
  // }

  // // @UseGuards(RolesGuard)
  // @RolesAllowed(Roles.ADMIN)
  // @Post('create-new-password')
  // async updateNewPassWord(@Body() updatePasswordDto: UpdatePassword) {
  //   return await this.service.updateNewPassWord(updatePasswordDto);
  // }
}
