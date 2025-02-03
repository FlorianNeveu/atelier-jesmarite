import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // Vérifier si l'utilisateur est admin au moment du chargement du Header
  useEffect(() => {
    const role = localStorage.getItem('role'); // Récupère le rôle depuis le localStorage
    if (role === 'admin') {
      setIsAdmin(true); // Si l'utilisateur est admin, mettre à jour l'état
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    setIsAuthenticated(false);
    localStorage.removeItem('role');  // Enlever aussi le rôle du localStorage
    alert("Déconnexion réussie !");
    navigate('/');  // Rediriger vers la page d'accueil après la déconnexion
  };

  return (
    <header>
      <h1>Atelier de Jesmarite</h1>
      {isAuthenticated ? (
        <div>
          {isAdmin && (
            <button onClick={() => navigate("/dashboard")}>Dashboard</button> // Lien vers le Dashboard
          )}
          <button onClick={handleLogout}>Se déconnecter</button>
        </div>
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
