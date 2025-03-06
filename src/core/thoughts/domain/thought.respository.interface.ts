import { SearchParamsInterface } from '../../shared/domain/search.interface';
import { Thought } from './thought.entity';

export interface ThoughtPaginateResult {
  items: Thought[];
  page: number;
  perPage: number;
  total: number;
  lastPage: number;
}

export interface ThoughtWhereConditions {
  userId?: string | string[];
}

export interface ThoughtRepositoryInterface {
  create(entity: Thought): Promise<void>;
  existsById(id: string): Promise<boolean>;
  countToDayByUserId(userId: string, date: Date): Promise<number>;
  findPaginate(
    params: SearchParamsInterface,
    where?: ThoughtWhereConditions,
  ): Promise<ThoughtPaginateResult>;
}
