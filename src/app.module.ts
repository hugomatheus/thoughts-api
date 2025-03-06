import { Module } from '@nestjs/common';
import { EnvironmentModule } from './config/environment/environment.module';
import { DatabaseModule } from './config/database/database.module';
import { ThoughtsModule } from './modules/thoughts/thoughts.module';
import { UsersModule } from './modules/users/users.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './modules/shared/interceptors/logging.interceptor';
import { CacheProviderModule } from './config/cache/cache.module';

@Module({
  imports: [
    EnvironmentModule,
    DatabaseModule,
    CacheProviderModule,
    ThoughtsModule,
    UsersModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
