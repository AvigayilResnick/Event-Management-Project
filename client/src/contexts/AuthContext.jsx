import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem("token"));

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const login = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const refreshAuthToken = async () => {
    try {
      const response = await fetch("/api/auth/refresh", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to refresh token");

      const { token: newToken } = await response.json();
      const decoded = JSON.parse(atob(newToken.split(".")[1]));

      setToken(newToken);
      setUser({ id: decoded.id, role: decoded.role });
    } catch (error) {
      console.error("Error refreshing token:", error);
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, refreshAuthToken }}>
      {children}
    </AuthContext.Provider>
  );
};
