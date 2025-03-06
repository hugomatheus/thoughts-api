import { Repository } from 'typeorm';
import { UserRepositoryInterface } from '../../..//domain/user.respository.interface';
import { UserEntity } from './user.entity';
import { User } from '../../../domain/user.entity';
import { UserMapper } from './user.mapper';

export class UserTypeOrmRepository implements UserRepositoryInterface {
  sortableFields: string[] = ['created_at'];
  constructor(private userRepository: Repository<UserEntity>) {}

  async findById(id: string): Promise<User | null> {
    const entity = await this.userRepository.findOne({ where: { id } });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async existsById(id: string): Promise<boolean> {
    return await this.userRepository.exists({ where: { id } });
  }
}
