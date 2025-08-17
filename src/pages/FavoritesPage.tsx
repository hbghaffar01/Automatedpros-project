import { Link } from 'react-router-dom';
import { Heart, ArrowLeft } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { useMultiplePokemonDetails } from '@/hooks/usePokemonDetails';
import { PokemonCard } from '@/components/features/resource-list/PokemonCard';
import { PokemonCardSkeleton } from '@/components/features/resource-list/PokemonCardSkeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/common/Button';
import type { Pokemon } from '@/types';

export function FavoritesPage() {
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  
  const favoriteIds = favorites.map(f => f.id);
  const detailsQueries = useMultiplePokemonDetails(favoriteIds);
  
  const favoritePokemon = detailsQueries
    .filter(q => q.isSuccess && q.data)
    .map(q => q.data as Pokemon);

  const isLoading = detailsQueries.some(q => q.isLoading);

  const handleToggleFavorite = (pokemon: Pokemon) => {
    toggleFavorite({
      id: pokemon.id,
      name: pokemon.name,
      imageUrl: pokemon.sprites.other['official-artwork'].front_default ||
                pokemon.sprites.front_default
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to all Pokémon
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">
            My Favorites
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {favorites.length} {favorites.length === 1 ? 'Pokémon' : 'Pokémon'} in your collection
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: Math.min(8, favorites.length) }).map((_, i) => (
            <PokemonCardSkeleton key={i} />
          ))}
        </div>
      ) : favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoritePokemon.map(pokemon => (
            <PokemonCard
              key={pokemon.id}
              pokemon={pokemon}
              isFavorite={isFavorite(pokemon.id)}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Heart className="w-12 h-12" />}
          title="No favorites yet"
          description="Start building your collection by clicking the heart icon on any Pokémon"
          action={
            <Link to="/">
              <Button>
                Browse Pokémon
              </Button>
            </Link>
          }
        />
      )}
    </div>
  );
}
