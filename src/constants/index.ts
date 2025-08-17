export const API_BASE_URL = 'https://pokeapi.co/api/v2';

export const ITEMS_PER_PAGE = 20;
export const SEARCH_DEBOUNCE_MS = 300;
export const CACHE_TIME = 30 * 60 * 1000;
export const STALE_TIME = 10 * 60 * 1000;

export const POKEMON_TYPES = [
  'normal',
  'fighting',
  'flying',
  'poison',
  'ground',
  'rock',
  'bug',
  'ghost',
  'steel',
  'fire',
  'water',
  'grass',
  'electric',
  'psychic',
  'ice',
  'dragon',
  'dark',
  'fairy',
] as const;

export const POKEMON_GENERATIONS = [
  { label: 'Generation I', value: '1', range: [1, 151] },
  { label: 'Generation II', value: '2', range: [152, 251] },
  { label: 'Generation III', value: '3', range: [252, 386] },
  { label: 'Generation IV', value: '4', range: [387, 493] },
  { label: 'Generation V', value: '5', range: [494, 649] },
  { label: 'Generation VI', value: '6', range: [650, 721] },
  { label: 'Generation VII', value: '7', range: [722, 809] },
  { label: 'Generation VIII', value: '8', range: [810, 905] },
  { label: 'Generation IX', value: '9', range: [906, 1025] },
] as const;

export const SORT_OPTIONS = [
  { label: 'ID (Low to High)', value: { field: 'id', order: 'asc' } as const },
  { label: 'ID (High to Low)', value: { field: 'id', order: 'desc' } as const },
  { label: 'Name (A-Z)', value: { field: 'name', order: 'asc' } as const },
  { label: 'Name (Z-A)', value: { field: 'name', order: 'desc' } as const },
  {
    label: 'Height (Low to High)',
    value: { field: 'height', order: 'asc' } as const,
  },
  {
    label: 'Height (High to Low)',
    value: { field: 'height', order: 'desc' } as const,
  },
  {
    label: 'Weight (Low to High)',
    value: { field: 'weight', order: 'asc' } as const,
  },
  {
    label: 'Weight (High to Low)',
    value: { field: 'weight', order: 'desc' } as const,
  },
] as const;

export const STORAGE_KEYS = {
  FAVORITES: 'pokemon-favorites',
  THEME: 'app-theme',
  NOTES: 'pokemon-notes',
} as const;
