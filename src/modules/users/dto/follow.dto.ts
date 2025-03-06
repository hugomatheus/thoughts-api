import { IsUUID, Validate } from 'class-validator';
import { checkUserIdExistValidatorConstraint } from '../../shared/validates/check-user-id-exists.validator';

export class FollowDto {
  @IsUUID(4)
  @Validate(checkUserIdExistValidatorConstraint)
  followerId: string;

  @IsUUID(4)
  @Validate(checkUserIdExistValidatorConstraint)
  followingId: string;
}
