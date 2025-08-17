import { useCallback, useMemo, useState, useEffect } from 'react';
import { favoritesStorage } from '@/utils/storage';
import type { FavoriteItem } from '@/types';

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() =>
    favoritesStorage.getAll()
  );

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'pokemon-favorites') {
        setFavorites(favoritesStorage.getAll());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const isFavorite = useCallback(
    (id: number) => {
      return favorites.some((fav) => fav.id === id);
    },
    [favorites]
  );

  const addFavorite = useCallback((item: Omit<FavoriteItem, 'addedAt'>) => {
    favoritesStorage.add(item);
    setFavorites(favoritesStorage.getAll());
  }, []);

  const removeFavorite = useCallback((id: number) => {
    favoritesStorage.remove(id);
    setFavorites(favoritesStorage.getAll());
  }, []);

  const toggleFavorite = useCallback(
    (item: Omit<FavoriteItem, 'addedAt'>) => {
      if (isFavorite(item.id)) {
        removeFavorite(item.id);
      } else {
        addFavorite(item);
      }
    },
    [isFavorite, removeFavorite, addFavorite]
  );

  const favoriteIds = useMemo(
    () => new Set(favorites.map((f) => f.id)),
    [favorites]
  );

  return {
    favorites,
    favoriteIds,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
  };
}
