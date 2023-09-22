import {
  Injectable,
  Inject,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CachingService {
  private logger = new Logger('REDIS');
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async get<T>(key: string): Promise<T | undefined> {
    const jsonData: string | undefined = await this.cache.get<string>(key);
    return jsonData ? JSON.parse(jsonData) : undefined;
  }

  async set(key: string, value: unknown, ttl = 0): Promise<void> {
    try {
      await this.cache.set(key, value, ttl);
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
