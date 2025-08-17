import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import type { Pokemon } from '@/types';
import { Button } from '@/components/common/Button';
import { cn } from '@/utils/cn';

interface PokemonCardProps {
  pokemon: Pokemon;
  isFavorite: boolean;
  onToggleFavorite: (pokemon: Pokemon) => void;
}

export const PokemonCard = memo(function PokemonCard({
  pokemon,
  isFavorite,
  onToggleFavorite
}: PokemonCardProps) {
  const imageUrl = pokemon.sprites.other['official-artwork'].front_default || 
                   pokemon.sprites.front_default;

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
    fairy: 'bg-pink-300'
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onToggleFavorite(pokemon);
  };

  return (
    <Link
      to={`/pokemon/${pokemon.id}`}
      data-testid="pokemon-card"
      className="block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group animate-fadeIn"
    >
      <div className="relative">
        <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={pokemon.name}
              className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No image
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          data-testid="favorite-button"
          className={cn(
            'absolute top-2 right-2 p-2',
            isFavorite && 'text-red-500'
          )}
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={cn('w-5 h-5', isFavorite && 'fill-current')} />
        </Button>
      </div>
      
      <div className="p-4">
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
          #{String(pokemon.id).padStart(3, '0')}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize mb-2">
          {pokemon.name}
        </h3>
        <div className="flex gap-2 flex-wrap">
          {pokemon.types.map(({ type }) => (
            <span
              key={type.name}
              data-testid="pokemon-type"
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
    </Link>
  );
});
