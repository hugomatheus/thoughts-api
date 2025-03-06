import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { FollowUserUseCase } from '../../core/users/application/follow-user.use-case';
import { ProfileUserUseCase } from '../../core/users/application/profile-user.use-case';
import { GetThoughtUserUseCase } from '../../core/users/application/get-thought-user.use-case';
import { UnfollowUserUseCase } from '../../core/users/application/unfollow-user.use-case';
import { FollowDto } from './dto/follow.dto';
import { CheckUserIdExistPipe } from '../shared/pipes/check-user-id-existis.pipe';

@Controller('users')
export class UsersController {
  constructor(
    private followUserUseCase: FollowUserUseCase,
    private profileUserUseCase: ProfileUserUseCase,
    private GetThoughtUserUseCase: GetThoughtUserUseCase,
    private unfollowUserUseCase: UnfollowUserUseCase,
  ) {}

  @Get(':currentUserId/profile/:profileUserId')
  async getProfile(
    @Param('currentUserId', ParseUUIDPipe, CheckUserIdExistPipe)
    currentUserId: string,
    @Param('profileUserId', ParseUUIDPipe, CheckUserIdExistPipe)
    profileUserId: string,
  ) {
    return await this.profileUserUseCase.execute({
      currentUserId,
      profileUserId,
    });
  }

  @Get(':userId/thoughts')
  async getThoughts(
    @Param('userId', ParseUUIDPipe, CheckUserIdExistPipe) userId: string,
    @Query('page', ParseIntPipe) page: number = 1,
  ) {
    return await this.GetThoughtUserUseCase.execute({
      userId,
      page,
    });
  }

  @Post('follow')
  async follow(@Body() dto: FollowDto) {
    await this.followUserUseCase.execute(dto);
  }

  @HttpCode(204)
  @Delete(':followerId/unfollow/:followingId')
  async unfollow(
    @Param('followerId', ParseUUIDPipe, CheckUserIdExistPipe)
    followerId: string,
    @Param('followingId', ParseUUIDPipe, CheckUserIdExistPipe)
    followingId: string,
  ) {
    await this.unfollowUserUseCase.execute({ followerId, followingId });
  }
}
