import type { FavoriteItem, Theme } from '@/types';
import { STORAGE_KEYS } from '@/constants';

export const favoritesStorage = {
  getAll: (): FavoriteItem[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  add: (item: Omit<FavoriteItem, 'addedAt'>): void => {
    const favorites = favoritesStorage.getAll();
    const newFavorite: FavoriteItem = {
      ...item,
      addedAt: new Date().toISOString()
    };
    favorites.push(newFavorite);
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  },

  remove: (id: number): void => {
    const favorites = favoritesStorage.getAll();
    const filtered = favorites.filter(fav => fav.id !== id);
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(filtered));
  },

  exists: (id: number): boolean => {
    const favorites = favoritesStorage.getAll();
    return favorites.some(fav => fav.id === id);
  },

  clear: (): void => {
    localStorage.removeItem(STORAGE_KEYS.FAVORITES);
  }
};

export const themeStorage = {
  get: (): Theme => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.THEME);
      return (stored as Theme) || 'system';
    } catch {
      return 'system';
    }
  },

  set: (theme: Theme): void => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }
};

export interface PokemonNote {
  pokemonId: number;
  note: string;
  updatedAt: string;
}

export const notesStorage = {
  get: (pokemonId: number): PokemonNote | null => {
    try {
      const notes = localStorage.getItem(STORAGE_KEYS.NOTES);
      if (!notes) return null;
      const notesMap: Record<string, PokemonNote> = JSON.parse(notes);
      return notesMap[pokemonId] || null;
    } catch {
      return null;
    }
  },

  set: (pokemonId: number, note: string): void => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.NOTES);
      const notesMap: Record<string, PokemonNote> = stored ? JSON.parse(stored) : {};
      
      if (note.trim()) {
        notesMap[pokemonId] = {
          pokemonId,
          note,
          updatedAt: new Date().toISOString()
        };
      } else {
        delete notesMap[pokemonId];
      }
      
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notesMap));
    } catch (error) {
      console.error('Failed to save note:', error);
    }
  },

  remove: (pokemonId: number): void => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.NOTES);
      if (!stored) return;
      
      const notesMap: Record<string, PokemonNote> = JSON.parse(stored);
      delete notesMap[pokemonId];
      
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notesMap));
    } catch (error) {
      console.error('Failed to remove note:', error);
    }
  }
};
