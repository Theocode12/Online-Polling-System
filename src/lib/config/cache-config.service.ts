import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CacheOptionsFactory, CacheModuleOptions } from '@nestjs/cache-manager';
import { createKeyv, Keyv } from '@keyv/redis';
import { CacheableMemory } from 'cacheable';

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createCacheOptions(): CacheModuleOptions {
    return {
      ttl: this.configService.get<number>('CACHE_TTL', 5000),
      store: [
        new Keyv({
            store: new CacheableMemory({ ttl: this.configService.get<number>('CACHEABLE_MEMORY_TTL', 5000), lruSize: this.configService.get<number>('CACHEABLE_LRU_SIZE', 5000) }),
          }),
        createKeyv(`redis://${this.configService.get('REDIS_HOST', 'localhost')}:${this.configService.get('REDIS_PORT', 6379)}`),
      ]
    };
  }
}
