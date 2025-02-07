import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      <p>&copy; 2024 L'Atelier de Jesmarite</p>
      <nav>
        <ul>
          <li>
            <Link to="/privacy-policy">Politique de confidentialité</Link>
          </li>
          <li>
            <Link to="/terms-of-service">Conditions générales de vente</Link>
          </li>
          <li>
            <Link to="/about">À propos</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </nav>
    </footer>
  );
};

export default Footer;



