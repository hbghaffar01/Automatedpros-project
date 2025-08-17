import { apiClient } from '@/lib/api-client';
import type {
  PaginatedResponse,
  Pokemon,
  PokemonListItem,
  FilterOptions,
} from '@/types';
import { ITEMS_PER_PAGE, POKEMON_GENERATIONS } from '@/constants';
import { createBatcher } from '@/utils/batchRequests';

const pokemonBatcher = createBatcher<Pokemon>(
  async (ids: number[]) => {
    const chunkSize = 5;
    const chunks = [];

    for (let i = 0; i < ids.length; i += chunkSize) {
      chunks.push(ids.slice(i, i + chunkSize));
    }

    const results: Pokemon[] = [];

    for (const chunk of chunks) {
      const chunkResults = await Promise.all(
        chunk.map((id) => apiClient.get<Pokemon>(`/pokemon/${id}`))
      );
      results.push(...chunkResults);
    }

    return results;
  },
  20,
  100
);

export const pokemonService = {
  async getList(
    page: number = 1,
    filters?: FilterOptions
  ): Promise<PaginatedResponse<PokemonListItem>> {
    const offset = (page - 1) * ITEMS_PER_PAGE;

    if (filters?.generation) {
      const generation = POKEMON_GENERATIONS.find(
        (g) => g.value === filters.generation
      );
      if (generation) {
        const [minId, maxId] = generation.range;
        const limit = Math.min(ITEMS_PER_PAGE, maxId - minId + 1);
        const adjustedOffset = Math.max(0, minId - 1 + offset);

        return apiClient.get<PaginatedResponse<PokemonListItem>>(
          `/pokemon?limit=${limit}&offset=${adjustedOffset}`,
          { cancelKey: 'pokemon-list' }
        );
      }
    }

    return apiClient.get<PaginatedResponse<PokemonListItem>>(
      `/pokemon?limit=${ITEMS_PER_PAGE}&offset=${offset}`,
      { cancelKey: 'pokemon-list' }
    );
  },

  async getById(id: number): Promise<Pokemon> {
    return pokemonBatcher.request(id);
  },

  async getByName(name: string): Promise<Pokemon> {
    return apiClient.get<Pokemon>(`/pokemon/${name}`);
  },

  async getMany(ids: number[]): Promise<Pokemon[]> {
    const promises = ids.map((id) => this.getById(id));
    return Promise.all(promises);
  },

  async searchByName(query: string): Promise<Pokemon[]> {
    try {
      const response = await apiClient.get<PaginatedResponse<PokemonListItem>>(
        '/pokemon?limit=1500',
        { cancelKey: 'pokemon-search' }
      );

      const filtered = response.results.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(query.toLowerCase())
      );

      const limitedResults = filtered.slice(0, 20);
      const detailPromises = limitedResults.map((p) => {
        const id = parseInt(p.url.split('/')[6]);
        return this.getById(id);
      });

      return Promise.all(detailPromises);
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  },

  extractIdFromUrl(url: string): number {
    const parts = url.split('/');
    const id = parseInt(parts[parts.length - 2]);
    return id > 10000 ? 0 : id;
  },
};
