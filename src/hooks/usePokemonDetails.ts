import { useQuery, useQueries } from '@tanstack/react-query';
import { pokemonService } from '@/services/pokemon.service';
import { CACHE_TIME, STALE_TIME } from '@/constants';

export function usePokemonDetails(id: number | undefined) {
  return useQuery({
    queryKey: ['pokemon', id],
    queryFn: () => pokemonService.getById(id!),
    enabled: !!id,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

export function usePokemonDetailsByName(name: string | undefined) {
  return useQuery({
    queryKey: ['pokemon', name],
    queryFn: () => pokemonService.getByName(name!),
    enabled: !!name,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
  });
}

export function useMultiplePokemonDetails(ids: number[]) {
  return useQueries({
    queries: ids.map(id => ({
      queryKey: ['pokemon', id],
      queryFn: () => pokemonService.getById(id),
      staleTime: STALE_TIME,
      gcTime: CACHE_TIME,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    })),
  });
}
