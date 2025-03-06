import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CacheService } from '../../core/shared/services/cache.service';

@Module({
  imports: [CacheModule.register({ isGlobal: true })],
  providers: [
    {
      provide: CacheService,
      useFactory: (cacheManager: Cache) => {
        return new CacheService(cacheManager);
      },
      inject: [CACHE_MANAGER],
    },
  ],
  exports: [CacheService],
})
export class CacheProviderModule {}
