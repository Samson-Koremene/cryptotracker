import { useState, useEffect } from "react";

const FAVORITES_KEY = "crypto-favorites";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (cryptoId: string) => {
    setFavorites((prev) =>
      prev.includes(cryptoId)
        ? prev.filter((id) => id !== cryptoId)
        : [...prev, cryptoId]
    );
  };

  const isFavorite = (cryptoId: string) => favorites.includes(cryptoId);

  return { favorites, toggleFavorite, isFavorite };
};
