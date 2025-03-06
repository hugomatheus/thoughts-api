import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Validate,
  ValidateIf,
} from 'class-validator';
import { checkThoughtIdExistValidatorConstraint } from '../validates/check-thought-id-exists.validator';
import { checkUserIdExistValidatorConstraint } from '../../shared/validates/check-user-id-exists.validator';

export class CreateThoughtDto {
  @IsNotEmpty()
  @IsUUID(4)
  @Validate(checkUserIdExistValidatorConstraint)
  userId: string;

  @IsOptional()
  @IsUUID(4)
  @Validate(checkThoughtIdExistValidatorConstraint)
  referenceThoughtId?: string | null;

  @ValidateIf(
    (dto: CreateThoughtDto) =>
      dto.referenceThoughtId === undefined || dto.referenceThoughtId === null,
  )
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  content?: string;
}
