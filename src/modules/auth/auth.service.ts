import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Hash } from './../../utils/Hash';
import { Role, User } from '../entities';
import { UsersService } from './../user';
import { LoginPayload } from './dto';
import { ConfigService } from '@nestjs/config';
// import { userInfo } from 'os';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { ResetPasswordDto } from './dto';
interface Tokens {
  accessToken: string;
  refreshToken: string;
}
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {}

  async createToken(user: User): Promise<Tokens> {
    const issuedTime = Math.floor(Date.now() / 1000);
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      iat: issuedTime,
    });
    const refreshToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        iat: issuedTime,
      },
      { expiresIn: this.configService.get('auth.refreshTokenTime') },
    );
    return {
      accessToken,
      refreshToken,
    };
  }

  async validateUser(payload: LoginPayload): Promise<any> {
    const user = await this.userService.getByUserEmail(payload.email);
    if (!user || !Hash.compare(payload.password, user.password)) {
      throw new UnauthorizedException('Invalid email or password!');
    }
    return user;
  }
  async findRole(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: {
        id,
      },
    });
    return role;
  }

  async forgotPassword(email: string): Promise<any> {
    const user = await this.userService.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'emailNotExists',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    } else {
      const resetPasswordToken = uuidv4();
      const resetPasswordTokenExpire = moment()
        .add(10, 'minutes')
        .toISOString();
      user.resetPasswordToken = resetPasswordToken;
      user.resetPasswordTokenExpire = resetPasswordTokenExpire;
      await this.userService.updateUser(user);
      // await this.mailService.forgotPassword({
      //   to: email,
      //   data: {
      //     hash: resetPasswordToken,
      //   },
      // });
      return {
        message:
          'Your reset password request has been confirmed. Please check your email, the token will expire in 10 minutes!',
      };
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<any> {
    const user = await this.userService.findOne({
      where: {
        email: resetPasswordDto.email,
      },
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'emailNotExists',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    } else {
      if (resetPasswordDto.resetPasswordToken !== user.resetPasswordToken) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            messageCode: 'auth.invalidResetToken',
          },
          HttpStatus.BAD_REQUEST,
        );
      } else if (moment().isAfter(moment(user.resetPasswordTokenExpire))) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            messageCode: 'auth.expiredResetToken',
          },
          HttpStatus.BAD_REQUEST,
        );
      } else if (
        user.resetPasswordTokenExpire &&
        user.resetPasswordToken &&
        resetPasswordDto.resetPasswordToken === user.resetPasswordToken &&
        moment(user.resetPasswordTokenExpire).isAfter(moment())
      ) {
        user.resetPasswordToken = null;
        user.resetPasswordTokenExpire = null;
        user.password = resetPasswordDto.newPassword;
        await this.userService.updateUser(user);
        return {
          message: 'Your password has been reset',
        };
      }
    }
  }
}
