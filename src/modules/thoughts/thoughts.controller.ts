import { Controller, Post, Body } from '@nestjs/common';
import { CreateThoughtDto } from './dto/create-thought.dto';
import { CreateThoughtUseCase } from '../../core/thoughts/application/create-thought.use-case';
import { ListThoughtUseCase } from '../../core/thoughts/application/list-thought.use-case';
import { FeedThoughtDto } from './dto/feed.dto';

@Controller('thoughts')
export class ThoughtsController {
  constructor(
    private createThoughtUseCase: CreateThoughtUseCase,
    private listThoughtUseCase: ListThoughtUseCase,
  ) {}

  @Post()
  async create(@Body() createDto: CreateThoughtDto) {
    return await this.createThoughtUseCase.execute(createDto);
  }

  @Post('/feed')
  async feed(@Body() dto: FeedThoughtDto) {
    return await this.listThoughtUseCase.execute(dto);
  }
}
