import { Pagination } from 'nestjs-typeorm-paginate';

export function mapPagination<TSource, TResponse>(
  pagination: Pagination<TSource>,
  mapper: (item: TSource) => TResponse,
): Pagination<TResponse> {
  return {
    ...pagination,
    items: pagination.items.map(mapper),
  };
}
