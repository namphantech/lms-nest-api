import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  UseGuards,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './';
import { GetCurrentUser } from './../common/decorators';
import { UsersService } from './../user';
import { User } from '../entities';
import {
  LoginPayload,
  RegisterPayload,
  AuthForgotPasswordDto,
  ResetPasswordDto,
} from './dto';

import { Tokens } from './auth.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('api/auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post('login')
  async login(@Body() payload: LoginPayload): Promise<any> {
    const user: User = await this.authService.validateUser(payload);
    const tokens = await this.authService.createToken(user.id);
    return {
      user,
      tokens,
    };
  }

  @Post('register')
  async register(@Body() payload: RegisterPayload): Promise<any> {
    const checkEmailUser = await this.userService.findOne({
      where: {
        email: payload.email,
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
    const roleData = await this.authService.findRole(payload.roleId);
    if (!roleData || !roleData.id) {
      throw new BadRequestException('Role not found');
    }
    const createUserData = {
      ...payload,
      role: roleData,
    };

    const user = await this.userService.create(createUserData);
    const tokens = await this.authService.createToken(user.id);
    return {
      user,
      tokens,
    };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get('me')
  async getLoggedInUser(@GetCurrentUser() user: User): Promise<User> {
    return user;
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: AuthForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Post('refresh-token')
  async refresh(@Body() dto: RefreshTokenDto): Promise<Tokens> {
    const payload = await this.authService.verifyRefreshToken(dto.refreshToken);
    const token = await this.authService.createToken(payload.sub);
    return token;
  }
}
