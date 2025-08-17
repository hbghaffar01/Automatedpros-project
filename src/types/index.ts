export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  sprites: {
    front_default: string | null;
    front_shiny: string | null;
    other: {
      'official-artwork': {
        front_default: string | null;
      };
    };
  };
  types: Array<{
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }>;
  abilities: Array<{
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }>;
  stats: Array<{
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }>;
}

export interface FilterOptions {
  type?: string;
  generation?: string;
  favorites?: boolean;
}

export interface SortOption {
  field: 'name' | 'id' | 'height' | 'weight';
  order: 'asc' | 'desc';
}

export interface SearchParams {
  query: string;
  filters: FilterOptions;
  sort: SortOption;
  page: number;
}

export interface FavoriteItem {
  id: number;
  name: string;
  imageUrl: string | null;
  addedAt: string;
}

export type Theme = 'light' | 'dark' | 'system';
