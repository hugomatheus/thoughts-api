import { Inject, Injectable } from '@nestjs/common';
import {
  isUUID,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UserRepositoryInterface } from '../../../core/users/domain/user.respository.interface';

@ValidatorConstraint({
  name: 'checkUserIdExistValidatorConstraint',
  async: true,
})
@Injectable()
export class checkUserIdExistValidatorConstraint
  implements ValidatorConstraintInterface
{
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async validate(id: string): Promise<boolean> {
    if (id && typeof id === 'string' && isUUID(id)) {
      return this.userRepository.existsById(id);
    }
    return false;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    const propertyName = validationArguments?.property;
    return `${propertyName} not found`;
  }
}
