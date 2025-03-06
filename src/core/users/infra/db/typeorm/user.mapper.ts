import { UserEntity } from './user.entity';
import { User } from '../../..//domain/user.entity';

export class UserMapper {
  static toDomain(entity: UserEntity): User {
    return new User({
      id: entity.id ?? null,
      name: entity.name,
      createdAt: entity.createdAt,
    });
  }

  static toEntity(domain: User): UserEntity {
    return Object.assign(new UserEntity(), domain);
  }
}
