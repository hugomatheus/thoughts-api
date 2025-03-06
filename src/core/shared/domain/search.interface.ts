export type SortDirection = 'asc' | 'desc';

export interface SearchParamsInterface {
  page?: number;
  perPage?: number;
  sort?: string | null;
  sortDir?: SortDirection;
}
