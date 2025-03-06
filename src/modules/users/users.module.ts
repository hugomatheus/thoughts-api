import { Module } from '@nestjs/common';
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { UsersController } from './users.controller';
import { UserTypeOrmRepository } from '../../core/users/infra/db/typeorm/user-typeorm.repository';
import { UserEntity } from '../../core/users/infra/db/typeorm/user.entity';
import { FollowerTypeOrmRepository } from '../../core/followers/infra/db/typeorm/follower-typeorm.repository';
import { FollowerEntity } from '../../core/followers/infra/db/typeorm/follower.entity';
import { FollowUserUseCase } from '../../core/users/application/follow-user.use-case';
import { UserRepositoryInterface } from '../../core/users/domain/user.respository.interface';
import { FollowerRepositoryInterface } from '../../core/followers/domain/follower.respository.interface';
import { ProfileUserUseCase } from '../../core/users/application/profile-user.use-case';
import { GetThoughtUserUseCase } from '../../core/users/application/get-thought-user.use-case';
import { ThoughtRepositoryInterface } from '../../core/thoughts/domain/thought.respository.interface';
import { ThoughtTypeOrmRepository } from '../../core/thoughts/infra/db/typeorm/thought-typeorm.repository';
import { ThoughtEntity } from '../../core/thoughts/infra/db/typeorm/thought.entity';
import { UnfollowUserUseCase } from '../../core/users/application/unfollow-user.use-case';
import { CheckUserIdExistPipe } from '../shared/pipes/check-user-id-existis.pipe';
import { CacheService } from '../../core/shared/services/cache.service';
import { CacheProviderModule } from '../../config/cache/cache.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ThoughtEntity, UserEntity, FollowerEntity]),
    CacheProviderModule,
  ],
  controllers: [UsersController],
  providers: [
    CheckUserIdExistPipe,
    {
      provide: UserTypeOrmRepository,
      useFactory: (dataSource: DataSource) => {
        return new UserTypeOrmRepository(dataSource.getRepository(UserEntity));
      },
      inject: [getDataSourceToken()],
    },
    {
      provide: FollowerTypeOrmRepository,
      useFactory: (dataSource: DataSource) => {
        return new FollowerTypeOrmRepository(
          dataSource.getRepository(FollowerEntity),
        );
      },
      inject: [getDataSourceToken()],
    },
    {
      provide: ThoughtTypeOrmRepository,
      useFactory: (dataSource: DataSource) => {
        return new ThoughtTypeOrmRepository(
          dataSource.getRepository(ThoughtEntity),
        );
      },
      inject: [getDataSourceToken()],
    },
    {
      provide: 'UserRepositoryInterface',
      useExisting: UserTypeOrmRepository,
    },
    {
      provide: 'FollowerRepositoryInterface',
      useExisting: FollowerTypeOrmRepository,
    },
    {
      provide: 'ThoughtRepositoryInterface',
      useExisting: ThoughtTypeOrmRepository,
    },
    {
      provide: FollowUserUseCase,
      useFactory: (
        userRepository: UserRepositoryInterface,
        followerRepository: FollowerRepositoryInterface,
      ) => {
        return new FollowUserUseCase(userRepository, followerRepository);
      },
      inject: [UserTypeOrmRepository, FollowerTypeOrmRepository],
    },
    {
      provide: ProfileUserUseCase,
      useFactory: (
        userRepository: UserRepositoryInterface,
        followerRepository: FollowerRepositoryInterface,
        cacheService: CacheService,
      ) => {
        return new ProfileUserUseCase(
          userRepository,
          followerRepository,
          cacheService,
        );
      },
      inject: [UserTypeOrmRepository, FollowerTypeOrmRepository, CacheService],
    },
    {
      provide: GetThoughtUserUseCase,
      useFactory: (
        userRepository: UserRepositoryInterface,
        thoughtRepository: ThoughtRepositoryInterface,
      ) => {
        return new GetThoughtUserUseCase(userRepository, thoughtRepository);
      },
      inject: [UserTypeOrmRepository, ThoughtTypeOrmRepository],
    },
    {
      provide: UnfollowUserUseCase,
      useFactory: (followerRepository: FollowerRepositoryInterface) => {
        return new UnfollowUserUseCase(followerRepository);
      },
      inject: [FollowerTypeOrmRepository],
    },
  ],
})
export class UsersModule {}
