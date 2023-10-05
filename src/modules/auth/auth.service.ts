import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Hash } from './../../utils/Hash';
import { Role } from '../entities';
import { UsersService } from './../user';
import { LoginPayload } from './dto';
import { ConfigService } from '@nestjs/config';
// import { userInfo } from 'os';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { ResetPasswordDto } from './dto';
// import { MyMailService } from './../mail/mail.service';
import { Message } from './../common/constants/message';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
export interface Tokens {
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
    // private readonly mailService: MyMailService,
    @InjectQueue('send-mail-queue') private mailQueue: Queue,
  ) {}

  async createToken(userId: number): Promise<Tokens> {
    // using algorithm HS256 to generate a signature
    const issuedTime = Math.floor(Date.now() / 1000);
    const accessToken = await this.jwtService.signAsync({
      sub: userId,
      iat: issuedTime,
    });
    const refreshToken = await this.jwtService.signAsync(
      {
        sub: userId,
        iat: issuedTime,
      },
      { expiresIn: this.configService.get('auth.refreshTokenTime') },
    );
    return {
      accessToken,
      refreshToken,
    };
  }

  async verifyRefreshToken(refreshToken: string): Promise<any> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get('auth.secret'),
      });

      return payload;
    } catch (error) {
      throw new HttpException(Message.INVALID_TOKEN, HttpStatus.UNAUTHORIZED);
    }
  }

  async validateUser(payload: LoginPayload): Promise<any> {
    const user = await this.userService.getByUserEmail(payload.email);
    if (!user || !Hash.compare(payload.password, user.password)) {
      throw new UnauthorizedException('Invalid email or password!');
    }
    delete user.password;
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
        'emailNotExists',
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
      const job = await this.mailQueue.add('reset-password', {
        to: email,
        data: {
          hash: resetPasswordToken,
        },
      });
      return {
        message:
          'Your reset password request has been confirmed. Please check your email, the token will expire in 10 minutes!',
        jobQueueId: job.id,
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
        'emailNotExists',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    } else {
      if (resetPasswordDto.resetPasswordToken !== user.resetPasswordToken) {
        throw new HttpException('invalidResetToken', HttpStatus.BAD_REQUEST);
      } else if (moment().isAfter(moment(user.resetPasswordTokenExpire))) {
        throw new HttpException('expiredResetToken', HttpStatus.BAD_REQUEST);
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
