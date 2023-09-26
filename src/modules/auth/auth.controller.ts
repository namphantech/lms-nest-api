import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  BadRequestException,
  // UseInterceptors,
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
import { CachingService } from 'modules/caching/caching.service';
import { GetMeDto } from './dto/get-me.dto';
// import { CacheKey, CacheInterceptor } from '@nestjs/cache-manager';

@Controller('api/auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly cachingService: CachingService,
  ) {}

  @Post('login')
  async login(@Body() payload: LoginPayload): Promise<any> {
    const user: Partial<User> = await this.authService.validateUser(payload);
    const tokens = await this.authService.createToken(user.id);
    console.log(user);
    await this.cachingService.set(`${user.id}`, user, 600);
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
      throw new BadRequestException('emailDuplicated');
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
    delete user.password;
    return {
      user,
      tokens,
    };
  }

  @Post('me')
  async getLoggedInUser(@Body() dto: GetMeDto): Promise<User> {
    return await this.cachingService.get<User>(dto.id);
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
