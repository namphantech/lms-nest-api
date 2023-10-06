import {
  Injectable,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { UsersService } from './../user';

@Injectable()
export class CachingService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly userService: UsersService,
  ) {}

  async get<T>(key: string): Promise<T> {
    const cachedData: string | null = await this.cache.get<string>(key);

    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const dataFromDB = await this.getDataFromDB<T>(key);
    await this.cacheData(key, dataFromDB);

    return dataFromDB;
  }

  private async getDataFromDB<T>(key: string): Promise<T> {
    const dataFromDB = await this.userService.get(Number(key));
    return dataFromDB as unknown as T;
  }

  async cacheData(key: string, data: unknown, ttl = 300): Promise<void> {
    try {
      await this.cache.set(key, JSON.stringify(data), { ttl });
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
