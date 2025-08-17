import { useEffect, useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useInfinitePokemonList } from '@/hooks/usePokemonList';
import { useMultiplePokemonDetails } from '@/hooks/usePokemonDetails';
import { usePokemonSearch } from '@/hooks/usePokemonSearch';
import { useFavorites } from '@/hooks/useFavorites';
import { PokemonCard } from '@/components/features/resource-list/PokemonCard';
import { PokemonCardSkeleton } from '@/components/features/resource-list/PokemonCardSkeleton';
import { VirtualizedPokemonList } from '@/components/features/resource-list/VirtualizedPokemonList';
import { SearchFilters } from '@/components/features/resource-list/SearchFilters';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/common/Button';
import { parseSearchParams, buildSearchParams } from '@/utils/url';
import { pokemonService } from '@/services/pokemon.service';
import { ITEMS_PER_PAGE } from '@/constants';
import type { Pokemon } from '@/types';

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [useVirtualization, setUseVirtualization] = useState(false);
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
    rootMargin: '200px',
  });
  const { toggleFavorite, isFavorite, favoriteIds } = useFavorites();

  const params = parseSearchParams(searchParams);
  const {
    query = '',
    filters = {},
    sort = { field: 'id', order: 'asc' },
  } = params;

  const { data: searchResults, isLoading: isSearching } =
    usePokemonSearch(query);

  const {
    data: listData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingList,
    error: listError,
    refetch: refetchList,
  } = useInfinitePokemonList(filters);

  const allPokemonIds = useMemo(() => {
    if (!listData?.pages) return [];
    return listData.pages
      .flatMap((page) =>
        page.results.map((p) => pokemonService.extractIdFromUrl(p.url))
      )
      .filter((id) => id > 0 && id <= 1025);
  }, [listData]);

  const visiblePokemonIds = useMemo(() => {
    if (query || filters.favorites) return [];
    const currentPageCount = listData?.pages.length || 0;
    const maxItemsToFetch = ITEMS_PER_PAGE * (currentPageCount + 1);
    return allPokemonIds.slice(0, maxItemsToFetch);
  }, [allPokemonIds, query, filters.favorites, listData?.pages.length]);

  const detailsQueries = useMultiplePokemonDetails(visiblePokemonIds);

  const favoriteDetailsQueries = useMultiplePokemonDetails(
    filters.favorites ? Array.from(favoriteIds) : []
  );

  const allPokemon = useMemo(() => {
    if (query && searchResults) {
      return searchResults;
    }

    if (filters.favorites) {
      return favoriteDetailsQueries
        .filter((q) => q.isSuccess && q.data)
        .map((q) => q.data as Pokemon);
    }

    return detailsQueries
      .filter((q) => q.isSuccess && q.data)
      .map((q) => q.data as Pokemon);
  }, [
    query,
    searchResults,
    detailsQueries,
    filters.favorites,
    favoriteDetailsQueries,
  ]);

  const filteredPokemon = useMemo(() => {
    let result = [...allPokemon];

    if (filters.type) {
      result = result.filter((p) =>
        p.types.some((t) => t.type.name === filters.type)
      );
    }

    result.sort((a, b) => {
      const aValue = a[sort.field];
      const bValue = b[sort.field];

      if (typeof aValue === 'string') {
        return sort.order === 'asc'
          ? aValue.localeCompare(bValue as string)
          : (bValue as string).localeCompare(aValue);
      }

      return sort.order === 'asc'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

    return result;
  }, [allPokemon, filters, sort, isFavorite]);

  const updateUrlParams = useCallback(
    (newParams: typeof params) => {
      const newSearchParams = buildSearchParams(newParams);
      setSearchParams(newSearchParams, { replace: true });
    },
    [setSearchParams]
  );

  const handleSearchChange = useCallback(
    (newQuery: string) => {
      updateUrlParams({ ...params, query: newQuery });
    },
    [params, updateUrlParams]
  );

  const handleFilterChange = useCallback(
    (newFilters: typeof filters) => {
      updateUrlParams({ ...params, filters: newFilters });
    },
    [params, updateUrlParams]
  );

  const handleSortChange = useCallback(
    (newSort: typeof sort) => {
      updateUrlParams({ ...params, sort: newSort });
    },
    [params, updateUrlParams]
  );

  const handleToggleFavorites = useCallback(() => {
    const newFilters = { ...filters, favorites: !filters.favorites };
    updateUrlParams({ ...params, filters: newFilters });
  }, [params, filters, updateUrlParams]);

  const handleToggleFavorite = useCallback(
    (pokemon: Pokemon) => {
      toggleFavorite({
        id: pokemon.id,
        name: pokemon.name,
        imageUrl:
          pokemon.sprites.other['official-artwork'].front_default ||
          pokemon.sprites.front_default,
      });
    },
    [toggleFavorite]
  );

  const handleClearAll = useCallback(() => {
    updateUrlParams({
      query: '',
      filters: {},
      sort: { field: 'id', order: 'asc' },
      page: 1,
    });
  }, [updateUrlParams]);

  useEffect(() => {
    if (
      inView &&
      hasNextPage &&
      !isFetchingNextPage &&
      !query &&
      !filters?.favorites
    ) {
      fetchNextPage();
    }
  }, [
    inView,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    query,
    filters?.favorites,
  ]);

  useEffect(() => {
    if (!query && !filters?.favorites && hasNextPage && !isFetchingNextPage) {
      const currentPageCount = listData?.pages.length || 0;
      const loadedPokemonCount = currentPageCount * ITEMS_PER_PAGE;
      const displayedPokemonCount = filteredPokemon.length;

      if (displayedPokemonCount > loadedPokemonCount * 0.8) {
        fetchNextPage();
      }
    }
  }, [
    filteredPokemon.length,
    listData?.pages.length,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    query,
    filters?.favorites,
  ]);

  const isLoadingFavorites =
    filters.favorites && favoriteDetailsQueries.some((q) => q.isLoading);
  const isLoading =
    isLoadingList || (query && isSearching) || isLoadingFavorites;
  const showSkeletons =
    (isLoading && filteredPokemon.length === 0 && !filters.favorites) ||
    (isLoadingFavorites && favoriteIds.size > 0);

  if (listError && !query) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          icon={<AlertCircle className="w-12 h-12" />}
          title="Failed to load Pokémon"
          description={listError.message || 'Something went wrong'}
          action={<Button onClick={() => refetchList()}>Try again</Button>}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SearchFilters
        searchQuery={query}
        onSearchChange={handleSearchChange}
        filters={filters}
        onFilterChange={handleFilterChange}
        sort={sort}
        onSortChange={handleSortChange}
        showFavoritesOnly={!!filters.favorites}
        onToggleFavorites={handleToggleFavorites}
        onClearAll={handleClearAll}
      />

      {filteredPokemon.length > 100 && (
        <div className="flex items-center justify-end mb-6">
          <button
            onClick={() => setUseVirtualization(!useVirtualization)}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-full transition-colors duration-200 shadow-lg"
          >
            {useVirtualization ? 'Grid View' : 'List View'}
          </button>
        </div>
      )}

      {useVirtualization && filteredPokemon.length > 100 ? (
        <VirtualizedPokemonList
          pokemon={filteredPokemon}
          isFavorite={isFavorite}
          onToggleFavorite={handleToggleFavorite}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {showSkeletons &&
            Array.from({ length: 12 }).map((_, i) => (
              <PokemonCardSkeleton key={i} />
            ))}

          {filteredPokemon.map((pokemon) => (
            <PokemonCard
              key={pokemon.id}
              pokemon={pokemon}
              isFavorite={isFavorite(pokemon.id)}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}

      {!isLoading && filteredPokemon.length === 0 && (
        <EmptyState
          title={
            query
              ? 'No Pokémon found'
              : filters.favorites
                ? 'No favorites yet'
                : 'No Pokémon to display'
          }
          description={
            query
              ? `No results for "${query}"`
              : filters.favorites
                ? 'Start building your collection by clicking the heart icon on any Pokémon'
                : 'Try adjusting your filters'
          }
          action={
            filters.favorites ? undefined : (
              <Button
                variant="secondary"
                onClick={() => {
                  handleSearchChange('');
                  handleFilterChange({});
                }}
              >
                Clear filters
              </Button>
            )
          }
        />
      )}

      {!query && !filters.favorites && hasNextPage && (
        <div ref={loadMoreRef} className="h-10" aria-hidden="true" />
      )}

      {!query && !filters.favorites && isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <div className="flex items-center space-x-2 text-gray-400 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading more Pokémon...</span>
          </div>
        </div>
      )}
    </div>
  );
}
