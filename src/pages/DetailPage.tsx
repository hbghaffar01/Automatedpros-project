import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, AlertCircle } from 'lucide-react';
import { usePokemonDetails } from '@/hooks/usePokemonDetails';
import { useFavorites } from '@/hooks/useFavorites';
import { Button } from '@/components/common/Button';
import { Skeleton } from '@/components/common/Skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { NoteForm } from '@/components/features/resource-detail/NoteForm';
import { cn } from '@/utils/cn';

export function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();

  const pokemonId = id ? parseInt(id, 10) : undefined;
  const { data: pokemon, isLoading, error } = usePokemonDetails(pokemonId);

  const handleToggleFavorite = () => {
    if (!pokemon) return;

    toggleFavorite({
      id: pokemon.id,
      name: pokemon.name,
      imageUrl:
        pokemon.sprites.other['official-artwork'].front_default ||
        pokemon.sprites.front_default,
    });
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to list
        </Button>

        <EmptyState
          icon={<AlertCircle className="w-12 h-12" />}
          title="Failed to load Pokémon"
          description={error.message || 'Something went wrong'}
          action={
            <Button onClick={() => window.location.reload()}>Try again</Button>
          }
        />
      </div>
    );
  }

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

  const statNames: Record<string, string> = {
    hp: 'HP',
    attack: 'Attack',
    defense: 'Defense',
    'special-attack': 'Sp. Attack',
    'special-defense': 'Sp. Defense',
    speed: 'Speed',
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Button variant="ghost" onClick={() => navigate('/')} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to list
      </Button>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div className="flex flex-col items-center">
            {isLoading ? (
              <Skeleton className="w-full aspect-square rounded-lg" />
            ) : (
              <div className="w-full aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg p-8">
                <img
                  src={
                    pokemon?.sprites.other['official-artwork'].front_default ||
                    pokemon?.sprites.front_default ||
                    ''
                  }
                  alt={pokemon?.name}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            <Button
              variant="secondary"
              onClick={handleToggleFavorite}
              disabled={!pokemon}
              className="mt-4 w-full"
            >
              <Heart
                className={cn(
                  'w-5 h-5 mr-2',
                  pokemon &&
                    isFavorite(pokemon.id) &&
                    'fill-current text-red-500'
                )}
              />
              {pokemon && isFavorite(pokemon.id)
                ? 'Remove from favorites'
                : 'Add to favorites'}
            </Button>
          </div>

          <div className="space-y-6">
            {isLoading ? (
              <>
                <div>
                  <Skeleton className="h-8 w-48 mb-2" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-20" />
                  <Skeleton className="h-20" />
                </div>
              </>
            ) : pokemon ? (
              <>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white capitalize mb-2">
                    {pokemon.name}
                  </h1>
                  <p className="text-lg text-gray-500 dark:text-gray-400">
                    #{String(pokemon.id).padStart(3, '0')}
                  </p>
                </div>

                <div>
                  <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Types
                  </h2>
                  <div className="flex gap-2">
                    {pokemon.types.map(({ type }) => (
                      <span
                        key={type.name}
                        className={cn(
                          'px-3 py-1 text-sm font-medium text-white rounded-full',
                          typeColors[type.name] || 'bg-gray-400'
                        )}
                      >
                        {type.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Height
                    </p>
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">
                      {(pokemon.height / 10).toFixed(1)} m
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Weight
                    </p>
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">
                      {(pokemon.weight / 10).toFixed(1)} kg
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Abilities
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {pokemon.abilities.map(({ ability, is_hidden }) => (
                      <span
                        key={ability.name}
                        className={cn(
                          'px-3 py-1 text-sm rounded-full capitalize',
                          is_hidden
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                        )}
                      >
                        {ability.name.replace('-', ' ')}
                        {is_hidden && ' (Hidden)'}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>

        {pokemon && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Base Stats
            </h2>
            <div className="space-y-3">
              {pokemon.stats.map(({ stat, base_stat }) => {
                const maxStat = 255;
                const percentage = (base_stat / maxStat) * 100;

                return (
                  <div key={stat.name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {statNames[stat.name] || stat.name}
                      </span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {base_stat}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={cn(
                          'h-2 rounded-full transition-all duration-500',
                          base_stat < 50 && 'bg-red-500',
                          base_stat >= 50 && base_stat < 80 && 'bg-yellow-500',
                          base_stat >= 80 && base_stat < 100 && 'bg-green-500',
                          base_stat >= 100 && 'bg-blue-500'
                        )}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {pokemon && (
        <div className="mt-6">
          <NoteForm pokemonId={pokemon.id} pokemonName={pokemon.name} />
        </div>
      )}
    </div>
  );
}
