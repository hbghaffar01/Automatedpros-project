import { useQuery } from '@tanstack/react-query';
import { pokemonService } from '@/services/pokemon.service';
import { useDebounce } from './useDebounce';
import { SEARCH_DEBOUNCE_MS, CACHE_TIME, STALE_TIME } from '@/constants';

export function usePokemonSearch(query: string) {
  const debouncedQuery = useDebounce(query, SEARCH_DEBOUNCE_MS);

  return useQuery({
    queryKey: ['pokemon-search', debouncedQuery],
    queryFn: () => pokemonService.searchByName(debouncedQuery),
    enabled: debouncedQuery.length > 0,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
  });
}
