import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { pokemonService } from '@/services/pokemon.service';
import type { FilterOptions } from '@/types';
import { CACHE_TIME, STALE_TIME, ITEMS_PER_PAGE } from '@/constants';

export function usePokemonList(page: number, filters?: FilterOptions) {
  return useQuery({
    queryKey: ['pokemon-list', page, filters],
    queryFn: () => pokemonService.getList(page, filters),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    placeholderData: (previousData) => previousData,
  });
}

export function useInfinitePokemonList(filters?: FilterOptions) {
  return useInfiniteQuery({
    queryKey: ['pokemon-list-infinite', filters],
    queryFn: ({ pageParam = 1 }) => pokemonService.getList(pageParam, filters),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.next) return undefined;
      
      const loadedCount = allPages.length * ITEMS_PER_PAGE;
      if (loadedCount >= lastPage.count) return undefined;
      
      return allPages.length + 1;
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    initialPageParam: 1,
    getPreviousPageParam: undefined,
    maxPages: undefined,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}
