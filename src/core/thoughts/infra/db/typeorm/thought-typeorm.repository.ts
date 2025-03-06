import { In, MoreThanOrEqual, Repository } from 'typeorm';
import {
  ThoughtPaginateResult,
  ThoughtRepositoryInterface,
  ThoughtWhereConditions,
} from '../../../domain/thought.respository.interface';
import { Thought } from '../../../domain/thought.entity';
import { ThoughtMapper } from './thought.mapper';
import { ThoughtEntity } from './thought.entity';
import { SearchParamsInterface } from '../../../../shared/domain/search.interface';
import { createOrder } from '../../../../shared/infra/db/typeorm/utils/create-order.util';

export class ThoughtTypeOrmRepository implements ThoughtRepositoryInterface {
  sortableFields: string[] = ['createdAt'];
  constructor(private thoughtRepository: Repository<ThoughtEntity>) {}

  async create(thought: Thought): Promise<void> {
    const entity = ThoughtMapper.toEntity(thought);
    await this.thoughtRepository.insert(entity);
  }

  async existsById(id: string): Promise<boolean> {
    return await this.thoughtRepository.exists({ where: { id } });
  }

  async countToDayByUserId(userId: string, date: Date): Promise<number> {
    const dateStartedHours = new Date(date.setHours(0, 0, 0));
    return await this.thoughtRepository.count({
      where: {
        userId,
        createdAt: MoreThanOrEqual(dateStartedHours),
      },
    });
  }

  async findPaginate(
    params: SearchParamsInterface,
    conditions?: ThoughtWhereConditions,
  ): Promise<ThoughtPaginateResult> {
    const where = conditions ? this.createWhereConditions(conditions) : {};
    const { page, perPage, offset, order } = this.propsSearch(params);
    const [rows, count] = await this.thoughtRepository.findAndCount({
      where,
      relations: ['sentiment'],
      order,
      skip: offset,
      take: perPage,
    });

    return this.paginateOutput(rows, page, perPage, count);
  }

  private createWhereConditions(conditions: ThoughtWhereConditions) {
    const where: Record<string, any> = {};
    if (
      (typeof conditions.userId === 'string' && conditions.userId) ||
      (Array.isArray(conditions.userId) && conditions.userId.length > 0)
    ) {
      where.userId = Array.isArray(conditions.userId)
        ? In(conditions.userId)
        : conditions.userId;
    }
    return where;
  }

  private paginateOutput(
    rows: ThoughtEntity[],
    page: number,
    perPage: number,
    count: number,
  ) {
    return {
      items: rows.map((entity) => ThoughtMapper.toDomain(entity)),
      page,
      perPage,
      total: count,
      lastPage: Math.ceil(count / perPage),
    };
  }

  private propsSearch(params: SearchParamsInterface) {
    const page = Math.max(1, Number(params.page) || 1);
    const perPage = Math.max(1, Number(params.perPage) || 10);
    const offset = (page - 1) * perPage;
    const order = createOrder({
      ...params,
      sort:
        params.sort && this.sortableFields.includes(params.sort)
          ? params.sort
          : 'createdAt',
    });
    return { page, perPage, offset, order };
  }
}
