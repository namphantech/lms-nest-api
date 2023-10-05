import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { CachingService } from './caching.service';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateDataOnRedis } from './dto/create-data-on-redis.dto';
import { User } from './../entities/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/caching')
@ApiTags('caching')
@ApiBearerAuth()
@UseGuards(AuthGuard())
export class CachingController {
  constructor(private readonly cachingService: CachingService) {}

  @Get('/:key')
  async getDataOnRedis(@Param('key') key: string) {
    console.log(typeof key);
    console.log(key);
    const dataTest: User = await this.cachingService.get<User>(key);
    console.log(dataTest);
    return dataTest;
  }
  @Post('/')
  async addDataOnRedis(@Body() dto: CreateDataOnRedis) {
    await this.cachingService.cacheData(dto.key, dto.value, dto.ttl);
    return {
      message: 'add data on redis successfully!',
    };
  }
  @Delete('/:key')
  async deleteCacheByKey(@Param('key') key: string) {
    return await this.cachingService.del(key);
  }
}
