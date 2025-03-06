import { Module } from '@nestjs/common';
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { ThoughtsController } from './thoughts.controller';
import { ThoughtTypeOrmRepository } from '../../core/thoughts/infra/db/typeorm/thought-typeorm.repository';
import { CreateThoughtUseCase } from '../../core/thoughts/application/create-thought.use-case';
import { ThoughtRepositoryInterface } from '../../core/thoughts/domain/thought.respository.interface';
import { ThoughtEntity } from '../../core/thoughts/infra/db/typeorm/thought.entity';
import { checkThoughtIdExistValidatorConstraint } from './validates/check-thought-id-exists.validator';
import { SentimentApiInterface } from '../../core/sentiments/domain/sentiment-api.interface';
import { TextProcessingApiService } from '../../core/sentiments/infra/http/text-processing-api.service';
import { SentimentTypeOrmRepository } from '../../core/sentiments/infra/db/typeorm/sentiment-typeorm.repository';
import { SentimentEntity } from '../../core/sentiments/infra/db/typeorm/sentiment.entity';
import { ListThoughtUseCase } from '../../core/thoughts/application/list-thought.use-case';
import { FollowerRepositoryInterface } from '../../core/followers/domain/follower.respository.interface';
import { FollowerTypeOrmRepository } from '../../core/followers/infra/db/typeorm/follower-typeorm.repository';
import { FollowerEntity } from '../../core/followers/infra/db/typeorm/follower.entity';
import { UserTypeOrmRepository } from '../../core/users/infra/db/typeorm/user-typeorm.repository';
import { UserEntity } from '../../core/users/infra/db/typeorm/user.entity';
import { checkUserIdExistValidatorConstraint } from '../shared/validates/check-user-id-exists.validator';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [ThoughtsController],
  providers: [
    checkThoughtIdExistValidatorConstraint,
    checkUserIdExistValidatorConstraint,
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
      provide: SentimentTypeOrmRepository,
      useFactory: (dataSource: DataSource) => {
        return new SentimentTypeOrmRepository(
          dataSource.getRepository(SentimentEntity),
        );
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
      provide: UserTypeOrmRepository,
      useFactory: (dataSource: DataSource) => {
        return new UserTypeOrmRepository(dataSource.getRepository(UserEntity));
      },
      inject: [getDataSourceToken()],
    },
    {
      provide: 'ThoughtRepositoryInterface',
      useExisting: ThoughtTypeOrmRepository,
    },
    TextProcessingApiService,
    {
      provide: 'SentimentApiInterface',
      useExisting: TextProcessingApiService,
    },
    {
      provide: 'SentimentRepositoryInterface',
      useExisting: SentimentTypeOrmRepository,
    },
    {
      provide: 'FollowerRepositoryInterface',
      useExisting: FollowerTypeOrmRepository,
    },
    {
      provide: 'UserRepositoryInterface',
      useExisting: UserTypeOrmRepository,
    },
    {
      provide: CreateThoughtUseCase,
      useFactory: (
        thoughtRepository: ThoughtRepositoryInterface,
        sentimentApiService: SentimentApiInterface,
      ) => {
        return new CreateThoughtUseCase(thoughtRepository, sentimentApiService);
      },
      inject: [
        ThoughtTypeOrmRepository,
        TextProcessingApiService,
        SentimentTypeOrmRepository,
      ],
    },
    {
      provide: ListThoughtUseCase,
      useFactory: (
        thoughtRepository: ThoughtRepositoryInterface,
        followerRepository: FollowerRepositoryInterface,
      ) => {
        return new ListThoughtUseCase(thoughtRepository, followerRepository);
      },
      inject: [ThoughtTypeOrmRepository, FollowerTypeOrmRepository],
    },
  ],
})
export class ThoughtsModule {}
