import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Header = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role === 'admin') {
      setIsAdmin(true);
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    Cookies.remove('token');
    setIsAuthenticated(false);
    localStorage.removeItem('role');
    alert("Déconnexion réussie !");
    navigate('/');
  };

  return (
    <header>
      <h1>Atelier de Jesmarite</h1>
      {isAuthenticated ? (
        <div>
          {isAdmin && (
            <button onClick={() => navigate("/dashboard")}>Dashboard</button>
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
