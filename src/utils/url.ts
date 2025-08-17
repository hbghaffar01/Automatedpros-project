import type { SearchParams } from '@/types';

export const parseSearchParams = (searchParams: URLSearchParams): Partial<SearchParams> => {
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const sortField = searchParams.get('sortField') as any || 'id';
  const sortOrder = searchParams.get('sortOrder') as any || 'asc';
  const type = searchParams.get('type') || undefined;
  const generation = searchParams.get('generation') || undefined;
  const favorites = searchParams.get('favorites') === 'true';

  return {
    query,
    page,
    sort: { field: sortField, order: sortOrder },
    filters: { type, generation, favorites }
  };
};

export const buildSearchParams = (params: Partial<SearchParams>): URLSearchParams => {
  const searchParams = new URLSearchParams();

  if (params.query) {
    searchParams.set('q', params.query);
  }

  if (params.page && params.page > 1) {
    searchParams.set('page', params.page.toString());
  }

  if (params.sort) {
    searchParams.set('sortField', params.sort.field);
    searchParams.set('sortOrder', params.sort.order);
  }

  if (params.filters?.type) {
    searchParams.set('type', params.filters.type);
  }

  if (params.filters?.generation) {
    searchParams.set('generation', params.filters.generation);
  }

  if (params.filters?.favorites) {
    searchParams.set('favorites', 'true');
  }

  return searchParams;
};
