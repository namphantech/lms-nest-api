import authConfig from 'modules/config/auth.config';
import databaseConfig from '../config/database.config';
import redisConfig from '../config/redis.config';
import nodeMailConfig from '../config/mail.config';
import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { redisStore } from 'cache-manager-redis-yet';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from '../auth';
import { UserModule } from './../user';
import appConfig from 'modules/config/app.config';
import firebaseConfig from 'modules/config/firebase.config';
import { ProductModule } from 'modules/product/product.module';
console.log(__dirname);
console.log(__dirname + './**/**.entity{.ts,.js}');
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
        firebaseConfig,
      ],
    }),
    CacheModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          url: configService.get('redis.url'),
          ttl: configService.get('redis.ttl'),
        }),
      }),
      isGlobal: true,
      inject: [ConfigService],
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
          ssl: true,
          entities: [__dirname + './**/**.entity{.ts,.js}'],
        } as TypeOrmModuleAsyncOptions;
      },
    }),

    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    AuthModule,
    UserModule,
    ProductModule,
  ],
})
export class AppModule {}
