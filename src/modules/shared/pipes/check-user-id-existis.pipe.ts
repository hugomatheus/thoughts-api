import {
  PipeTransform,
  Injectable,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { UserRepositoryInterface } from '../../../core/users/domain/user.respository.interface';

@Injectable()
export class CheckUserIdExistPipe implements PipeTransform<any> {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async transform(id: string) {
    const exists = await this.userRepository.existsById(id);

    if (!exists) {
      throw new NotFoundException('user not found');
    }

    return id;
  }
}
