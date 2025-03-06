/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Cache } from 'cache-manager';

export class CacheService {
  constructor(private cacheManager: Cache) {}

  async setCache<T>(key: string, value: T, ttl: number): Promise<void> {
    await this.cacheManager.set(key, JSON.stringify(value), ttl);
  }

  async getCache<T>(key: string): Promise<T | null> {
    const cache: string | null = await this.cacheManager.get(key);
    if (cache) {
      return JSON.parse(cache) as T;
    }
    return null;
  }

  async removeCache(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }
}
