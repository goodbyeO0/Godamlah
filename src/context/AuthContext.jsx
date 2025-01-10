import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check localStorage on component mount
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const storedUser = JSON.parse(localStorage.getItem("user"));

    setIsLoggedIn(storedIsLoggedIn);
    setUser(storedUser);
  }, []);

  const login = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, user, login, logout, setIsLoggedIn }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
