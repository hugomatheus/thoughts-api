import { Cache } from 'cache-manager';
import * as cacheManager from 'cache-manager';
import { CacheService } from '../cache.service';

describe('CacheService Integration Unit', () => {
  let cache: Cache;
  let cacheService: CacheService;

  beforeAll(() => {
    cache = cacheManager.createCache();
    cacheService = new CacheService(cache);
  });

  beforeEach(async () => {
    await cache.clear();
  });

  afterAll(async () => {
    await cache.disconnect();
  });

  it('should create cache', async () => {
    await cacheService.setCache('key', { data: 'value' }, 1000);
    const cacheKey = await cache.get('key');
    expect(cacheKey).toBe(JSON.stringify({ data: 'value' }));
  });

  it('should retrieve a value from the cache', async () => {
    await cache.set('key', JSON.stringify({ data: 'value' }), 1000);
    const result = await cacheService.getCache<{ data: string }>('key');
    expect(result).toEqual({ data: 'value' });
  });

  it('should not found cache', async () => {
    const cacheKey = await cacheService.getCache('key');
    expect(cacheKey).toBeNull();
  });

  it('should remove cache', async () => {
    await cache.set('key', JSON.stringify({ data: 'value' }), 1000);
    await cacheService.removeCache('key');
    const cacheKey = await cache.get('key');
    expect(cacheKey).toBe(null);
  });
});
