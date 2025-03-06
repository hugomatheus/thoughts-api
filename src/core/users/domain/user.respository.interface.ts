import { User } from './user.entity';

export interface UserRepositoryInterface {
  findById(id: string): Promise<User | null>;
  existsById(id: string): Promise<boolean>;
}
