import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from './../user';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../entities';
import { MailModule } from 'modules/mail/mail.module';
import { CachingModule } from 'modules/caching/caching.module';
import { BullModule } from '@nestjs/bull';
import { ResetPasswordProcessor } from './processors/reset-password.processor';
import { MyMailService } from 'modules/mail/mail.service';

@Module({
  imports: [
    UserModule,
    MailModule,
    BullModule.registerQueue({
      name: 'send-mail-queue',
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        password: process.env.REDIS_PASSWORD,
        port: Number(process.env.REDIS_PORT),
      },
    }),
    CachingModule,
    TypeOrmModule.forFeature([Role]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('auth.secret'),
          signOptions: {
            expiresIn: configService.get('auth.jwtExpires'),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, ResetPasswordProcessor, MyMailService],
  exports: [PassportModule.register({ defaultStrategy: 'jwt' })],
})
export class AuthModule {}
