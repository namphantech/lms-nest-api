import {
  Injectable,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { MyCache } from './../entities/cache.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CachingService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    @InjectRepository(MyCache) private readonly cacheRepo: Repository<MyCache>,
  ) {}

  async get<T>(key: string): Promise<T | undefined> {
    const jsonData: string | undefined = await this.cache.get<string>(key);
    if (jsonData) {
      return JSON.parse(jsonData);
    }
    const dataFromDB = await this.cacheRepo.findOne({
      where: {
        key,
      },
    });
    this.cache.set(dataFromDB.key, dataFromDB.value, dataFromDB.ttl);

    return JSON.parse(dataFromDB.value);
  }

  async set(key: string, value: unknown, ttl = 0): Promise<void> {
    try {
      await this.cache.set(key, JSON.stringify(value), ttl);
      await this.cacheRepo.upsert(
        {
          key,
          value: JSON.stringify(value),
          ttl,
        },
        {
          conflictPaths: ['key'],
        },
      );
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async del(key: string) {
    await this.cache.del(key);
  }

  async reset() {
    await this.cache.reset();
  }
}
