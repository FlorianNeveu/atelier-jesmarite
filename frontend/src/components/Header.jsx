import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";
import axiosInstance from "../axiosConfig";
import "../styles/Header.scss"; 

const Header = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const navigate = useNavigate();

  // Vérification de l'authentification de l'utilisateur
  const checkAuthStatus = async () => {
    try {
      const response = await axiosInstance.get('/auth/me', { withCredentials: true });

      if (response.data.user) {
        setIsAuthenticated(true);
        setIsAdmin(response.data.user.role === 'admin');
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'authentification', error);
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
  };

  // Appelle checkAuthStatus dès que le composant est monté
  useEffect(() => {
    checkAuthStatus();
  }, []);  // On appelle une seule fois au montage du composant

  // Déconnexion de l'utilisateur
  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error("Erreur déconnexion:", error);
    }
    Cookies.remove('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
    setIsAdmin(false);
    navigate('/', { replace: true });
  };

  // Gestion de l'affichage du menu hamburger
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Atelier de Jesmarite</Link>
      </div>

      <div className="hamburger" onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>

      {/* Navigation */}
      <nav className={`navigation ${isMenuOpen ? "open" : ""}`}>
        {isAuthenticated ? (
          <ul>
            {isAdmin && (
              <li>
                <button onClick={() => navigate("/dashboard")}>Dashboard</button>
              </li> 
            )}
            <li>
              <button onClick={handleLogout}>Se déconnecter</button>
            </li> 
            <li>
              <Link to="/products">Produits</Link>
            </li>
          </ul>
        ) : (
          <ul>
            <li>
              <Link to="/login">Se connecter</Link> 
            </li>
            <li>
              <Link to="/signup">S'inscrire</Link> 
            </li>
            <li>
              <Link to="/products">Produits</Link>
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
};

export default Header;
