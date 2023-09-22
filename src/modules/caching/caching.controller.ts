import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { CachingService } from './caching.service';

import { ApiTags } from '@nestjs/swagger';
import { CreateDataOnRedis } from './dto/create-data-on-redis.dto';

@Controller('api/caching')
@ApiTags('caching')
export class CachingController {
  constructor(private readonly cachingService: CachingService) {}

  @Get('/:key')
  async getDataOnRedis(@Param('key') key: string) {
    const dataTest: [] = await this.cachingService.get<[]>(key);
    console.log(dataTest);
    return dataTest;
  }
  @Post('/')
  async addDataOnRedis(@Body() dto: CreateDataOnRedis) {
    const transformData = JSON.stringify(dto.value);
    await this.cachingService.set(dto.key, transformData, dto.ttl);
    return {
      message: 'add data on redis successfully!',
    };
  }
}
