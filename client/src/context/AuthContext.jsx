import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("dormmart_token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
      } catch (err) {
        console.error("Auth check failed:", err);
        localStorage.removeItem("dormmart_token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [token]);

  const loginWithEmail = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("dormmart_token", res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const registerWithEmail = async (fullName, email, password) => {
    const res = await api.post("/auth/register", { fullName, email, password });
    localStorage.setItem("dormmart_token", res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const loginWithGoogle = async (idToken) => {
    const res = await api.post("/auth/google", { idToken });
    localStorage.setItem("dormmart_token", res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("dormmart_token");
    setToken(null);
    setUser(null);
  };

  const updateUserProfile = async (updateData) => {
    const res = await api.patch("/auth/profile", updateData);
    setUser(res.data.user);
    return res.data.user;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: Boolean(user),
        isAdmin: user?.role === "ADMIN",
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
