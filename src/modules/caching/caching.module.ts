import { Module } from '@nestjs/common';
import { CachingService } from './caching.service';
import { CachingController } from './caching.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MyCache } from './../entities/cache.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MyCache])],
  controllers: [CachingController],
  providers: [CachingService],
  exports: [CachingService],
})
export class CachingModule {}
