import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

  const handleLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    setIsAuthenticated(false);
    alert("Déconnexion réussie !");
  };

  return (
    <header>
      <h1>Atelier de Jesmarite</h1>
      {isAuthenticated ? (
        <button onClick={handleLogout}>Se déconnecter</button>
      ) : (
        <div>
          <a href="/login">Se connecter</a>
          <a href="/signup">S'inscrire</a>
        </div>
      )}
    </header>
  );
};

export default Header;
