import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();
// Contexte d'authentification pour maintenir le statut d'authentification et d'admin
const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, isAdmin, setIsAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
