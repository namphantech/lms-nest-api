import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';

import { CachingService } from './caching.service';

import { ApiTags } from '@nestjs/swagger';
import { CreateDataOnRedis } from './dto/create-data-on-redis.dto';
import { User } from './../entities/user.entity';

@Controller('api/caching')
@ApiTags('caching')
export class CachingController {
  constructor(private readonly cachingService: CachingService) {}

  @Get('/:key')
  async getDataOnRedis(@Param('key') key: string) {
    const dataTest: User = await this.cachingService.get<User>(key);
    console.log(dataTest);
    return dataTest;
  }
  @Post('/')
  async addDataOnRedis(@Body() dto: CreateDataOnRedis) {
    await this.cachingService.set(dto.key, dto.value, dto.ttl);
    return {
      message: 'add data on redis successfully!',
    };
  }
  @Delete('/:key')
  async deleteCacheByKey(@Param('key') key: string) {
    return await this.cachingService.del(key);
  }
}
