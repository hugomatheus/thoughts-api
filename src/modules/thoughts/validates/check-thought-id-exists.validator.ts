import { Inject, Injectable } from '@nestjs/common';
import {
  isUUID,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ThoughtRepositoryInterface } from '../../../core/thoughts/domain/thought.respository.interface';

@ValidatorConstraint({
  name: 'checkThoughtIdExistValidatorConstraint',
  async: true,
})
@Injectable()
export class checkThoughtIdExistValidatorConstraint
  implements ValidatorConstraintInterface
{
  constructor(
    @Inject('ThoughtRepositoryInterface')
    private readonly thoughtRepository: ThoughtRepositoryInterface,
  ) {}

  async validate(id: string): Promise<boolean> {
    if (id && typeof id === 'string' && isUUID(id)) {
      return this.thoughtRepository.existsById(id);
    }
    return false;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    const propertyName = validationArguments?.property;
    return `${propertyName} not found`;
  }
}
