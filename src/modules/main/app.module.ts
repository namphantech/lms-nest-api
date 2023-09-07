import authConfig from 'modules/config/auth.config';
import databaseConfig from '../config/database.config';
import redisConfig from '../config/redis.config';
import nodeMailConfig from '../config/mail.config';
import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { redisStore } from 'cache-manager-redis-store';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from '../auth';
import { UserModule } from './../user';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [nodeMailConfig, databaseConfig, redisConfig, authConfig],
    }),
    CacheModule.register({
      isGlobal: true,
      host: 'localhost',
      store: redisStore as any,
      port: 6379,
      ttl: 300,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          url: configService.get('database.url'),
          type: configService.get('database.type'),
          host: configService.get('database.host'),
          port: configService.get('database.port'),
          username: configService.get('database.username'),
          password: configService.get('database.password'),
          database: configService.get('database.database'),
          synchronize:
            configService.get('database.isAsync') === true ? true : false,
          autoLoadEntities: true,
          logging: true,
          entities: [__dirname + './../**/**.entity{.ts,.js}'],
        } as TypeOrmModuleAsyncOptions;
      },
    }),

    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
