import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [randomProducts, setRandomProducts] = useState([]);
  const API_URL = import.meta.env.API_URL || 'https://atelier-jesmarite-production.up.railway.app';
  const navigate = useNavigate();
  
  // Ajout d'un drapeau pour vérifier si les produits sont déjà récupérés
  const [productsFetched, setProductsFetched] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      if (productsFetched) return; // Si les produits ont déjà été récupérés, on ne les récupère pas à nouveau
      
      try {
        const response = await axiosInstance.get("/products");
        setProducts(response.data);

        const updateProducts = () => {
          const selectedProducts = [...response.data].sort(() => Math.random() - 0.5);
          const getProductsPerView = () => {
            if (window.innerWidth <= 480) return 2;
            if (window.innerWidth <= 1024) return 3;
            return 4;
          };
          setRandomProducts(selectedProducts.slice(0, getProductsPerView()));
        };

        updateProducts();
        setProductsFetched(true);  // Mettre à jour le drapeau pour indiquer que les produits ont été récupérés

        // Écoute de l'événement resize
        window.addEventListener('resize', updateProducts);
        return () => window.removeEventListener('resize', updateProducts);
      } catch (error) {
        console.error("Erreur lors de la récupération des produits :", error);
      }
    };

    fetchProducts();
  }, [productsFetched]); // Le useEffect se réexécutera seulement si productsFetched change

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`); 
  };

  const handleViewAllProducts = () => {
    navigate("/products");
  };

  const handleLearnMore = () => {
    navigate("/about"); 
  };

  const handleInstagramClick = () => {
    window.open("https://www.instagram.com/l_atelier_de_jesmarite/", "_blank");
  }

  const handleCollectionsClick = () => {
    navigate("/collections");
  }

  return (
    <div className="home">
      <div className="top-section">
        <div className="top-content">
          <Link className="top-title-link" to="/collections"><h2 className="top-title">Nos Collections</h2></Link>
          <button onClick={handleCollectionsClick} className="explore-btn">
            Explorer
          </button>
        </div>
        <button onClick={handleInstagramClick} className="instagram-btn">
            <img src="https://res.cloudinary.com/dpqyxkf2g/image/upload/v1738793038/instagram_wb4syz.png" alt="Instagram" />
        </button>
      </div>

      <h1>Bienvenue sur l'Atelier de Jesmarite</h1>
      <h2>Découvrez notre sélection</h2>
      <div className="product-list-home">
        {randomProducts.map((product) => (
          <div key={product.id} className="product-card-home" onClick={() => handleProductClick(product.id)}>
            <div className="vault">
              <img src={`${product.image}`} alt={product.name} />
            </div>
            <div className="square-content-home">
              <h3>{product.name}</h3>
              <p className="price">{product.price} €</p>
            </div>
          </div>
        ))}
      </div>
      <button className="view-all-btn" onClick={handleViewAllProducts}>Voir tous</button>

      <div className="intro-block">
        <h3>Découvrez L'Atelier de Jesmarite</h3>
        <p>
          La Jesmonite est un matériau innovant et écologique, utilisé pour créer des œuvres
          d'art et des objets décoratifs. Sa flexibilité et sa rapidité de prise en font un
          choix idéal pour des créations personnalisées et uniques.
        </p>
        <button className="learn-more-btn" onClick={handleLearnMore}>En savoir plus</button>
      </div>

      <div className="contact-section">
        <h3>Pour une commande personnalisée ou une question ? Contactez-nous</h3>
        <form action="https://formspree.io/f/florian.neveu@3wa.io" method="POST">
          <div className="left-column">
            <input type="text" name="name" placeholder="Votre nom" required />
            <input type="email" name="email" placeholder="Votre email" required />
          </div>
          <div className="right-column">
            <textarea name="message" placeholder="Votre message" rows="5" required></textarea>
            <button type="submit">Envoyer</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home;
