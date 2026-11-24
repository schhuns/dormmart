import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setFavorites([]);
      return;
    }

    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const res = await api.get("/favorites");
        setFavorites(res.data);
      } catch (err) {
        console.error("Failed to fetch favorites:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [isAuthenticated]);

  const isFavorite = (productId) => {
    return favorites.some((p) => p._id === productId);
  };

  const toggleFavorite = async (product) => {
    if (!isAuthenticated) return false;

    const currentlyFav = isFavorite(product._id);
    if (currentlyFav) {
      setFavorites((prev) => prev.filter((p) => p._id !== product._id));
    } else {
      setFavorites((prev) => [product, ...prev]);
    }

    try {
      await api.post(`/favorites/toggle/${product._id}`);
      return !currentlyFav;
    } catch (err) {
      // Revert if error
      if (currentlyFav) {
        setFavorites((prev) => [product, ...prev]);
      } else {
        setFavorites((prev) => prev.filter((p) => p._id !== product._id));
      }
      return currentlyFav;
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        loading,
        isFavorite,
        toggleFavorite,
        count: favorites.length,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
