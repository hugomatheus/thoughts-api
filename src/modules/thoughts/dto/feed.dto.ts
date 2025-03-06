import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  Validate,
  ValidateNested,
} from 'class-validator';
import { checkUserIdExistValidatorConstraint } from '../../shared/validates/check-user-id-exists.validator';

class FiltersParamsDto {
  @IsOptional()
  @IsBoolean()
  following?: boolean;
}

class PaginateParamsDto {
  @IsOptional()
  @IsInt()
  page?: number;
}

export class FeedThoughtDto {
  @IsDefined()
  @IsNotEmpty()
  @IsUUID(4)
  @Validate(checkUserIdExistValidatorConstraint)
  userId: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PaginateParamsDto)
  paginate?: PaginateParamsDto;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FiltersParamsDto)
  filters?: FiltersParamsDto;
}
