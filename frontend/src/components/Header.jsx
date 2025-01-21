import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.scss';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">L'Atelier Jesmarite</Link>
      </div>
      <nav className="navigation">
        <ul>
          <li><Link to="/">Accueil</Link></li>
          <li><Link to="/products">Produits</Link></li>
          <li><Link to="/signup">Compte</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
