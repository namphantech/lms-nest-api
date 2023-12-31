import authConfig from './../config/auth.config';
import databaseConfig from '../config/database.config';
import redisConfig from '../config/redis.config';
import nodeMailConfig from '../config/mail.config';
import appConfig from './../config/app.config';
import googleConfig from 'modules/config/google.config';
import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import * as redisStore from 'cache-manager-redis-store';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from '../auth';
import { UserModule } from './../user';
import { CachingModule } from './../caching/caching.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from '../config/rest/transform.interceptor';
import { ExceptionFilter } from '../config/exception/exception';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [
        nodeMailConfig,
        databaseConfig,
        redisConfig,
        authConfig,
        appConfig,
        googleConfig,
        // firebaseConfig,
      ],
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
      //url: process.env.REDIS_URL,
      ttl: Number(process.env.REDIS_TTL),
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
            configService.get('database.isAsync') === 'false' ? false : true,
          autoLoadEntities: true,
          logging: true,
          ssl: configService.get('database.ssl') === 'true' ? true : false,
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
    CachingModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: ExceptionFilter,
    },
  ],
})
export class AppModule {}
