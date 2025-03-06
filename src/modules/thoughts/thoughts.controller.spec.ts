import { Test, TestingModule } from '@nestjs/testing';
import { ThoughtsController } from './thoughts.controller';
import { CreateThoughtUseCase } from '../../core/thoughts/application/create-thought.use-case';
import { ListThoughtUseCase } from '../../core/thoughts/application/list-thought.use-case';

describe('ThoughtsController', () => {
  let controller: ThoughtsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ThoughtsController],
      providers: [CreateThoughtUseCase, ListThoughtUseCase],
    }).compile();

    controller = module.get<ThoughtsController>(ThoughtsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
