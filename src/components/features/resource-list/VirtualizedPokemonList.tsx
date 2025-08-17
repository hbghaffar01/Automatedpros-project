import { memo, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Heart } from 'lucide-react';
import type { Pokemon } from '@/types';
import { cn } from '@/utils/cn';

interface VirtualizedPokemonListProps {
  pokemon: Pokemon[];
  isFavorite: (id: number) => boolean;
  onToggleFavorite: (pokemon: Pokemon) => void;
}

const ITEM_HEIGHT = 100;

export const VirtualizedPokemonList = memo(function VirtualizedPokemonList({
  pokemon,
  isFavorite,
  onToggleFavorite,
}: VirtualizedPokemonListProps) {
  const typeColors: Record<string, string> = {
    normal: 'bg-gray-400',
    fighting: 'bg-red-600',
    flying: 'bg-indigo-400',
    poison: 'bg-purple-500',
    ground: 'bg-yellow-600',
    rock: 'bg-yellow-800',
    bug: 'bg-green-500',
    ghost: 'bg-purple-700',
    steel: 'bg-gray-500',
    fire: 'bg-red-500',
    water: 'bg-blue-500',
    grass: 'bg-green-600',
    electric: 'bg-yellow-400',
    psychic: 'bg-pink-500',
    ice: 'bg-blue-300',
    dragon: 'bg-purple-800',
    dark: 'bg-gray-800',
    fairy: 'bg-pink-300',
  };

  const Row = useCallback(
    ({ index, style, data }: any) => {
      const { items, toggleFavorite, checkFavorite } = data;
      const pokemon = items[index];

      if (!pokemon) return null;

      const imageUrl =
        pokemon.sprites.other['official-artwork'].front_default ||
        pokemon.sprites.front_default;

      return (
        <div style={style} className="px-4">
          <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="w-20 h-20 flex-shrink-0">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={pokemon.name}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100 dark:bg-gray-700 rounded">
                  No image
                </div>
              )}
            </div>

            <div className="flex-grow">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  #{String(pokemon.id).padStart(3, '0')}
                </span>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                  {pokemon.name}
                </h3>
              </div>
              <div className="flex gap-2">
                {pokemon.types.map(({ type }: { type: { name: string } }) => (
                  <span
                    key={type.name}
                    className={cn(
                      'px-2 py-1 text-xs font-medium text-white rounded-full',
                      typeColors[type.name] || 'bg-gray-400'
                    )}
                  >
                    {type.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleFavorite(pokemon);
                }}
                className={cn(
                  'p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
                  checkFavorite(pokemon.id) && 'text-red-500'
                )}
                aria-label={
                  checkFavorite(pokemon.id)
                    ? 'Remove from favorites'
                    : 'Add to favorites'
                }
              >
                <Heart
                  className={cn(
                    'w-5 h-5',
                    checkFavorite(pokemon.id) && 'fill-current'
                  )}
                />
              </button>
              <a
                href={`/pokemon/${pokemon.id}`}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = `/pokemon/${pokemon.id}`;
                }}
              >
                View Details
              </a>
            </div>
          </div>
        </div>
      );
    },
    [typeColors]
  );

  if (pokemon.length === 0) return null;

  return (
    <div style={{ height: 'calc(100vh - 300px)', width: '100%' }}>
      <AutoSizer>
        {({ height, width }) => (
          <List
            height={height}
            itemCount={pokemon.length}
            itemSize={ITEM_HEIGHT}
            width={width}
            itemData={{
              items: pokemon,
              toggleFavorite: onToggleFavorite,
              checkFavorite: isFavorite,
            }}
            className="scrollbar-hide"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {Row}
          </List>
        )}
      </AutoSizer>
    </div>
  );
});
