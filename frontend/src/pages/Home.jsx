// Page d'accueil

import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import ContactForm from "../components/ContactForm";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [randomProducts, setRandomProducts] = useState([]);
  const API_URL = import.meta.env.API_URL || 'https://atelier-jesmarite-production.up.railway.app';
  const navigate = useNavigate();
  
  const [productsFetched, setProductsFetched] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      if (productsFetched) return; 
      
      try {
        const response = await axiosInstance.get("/products");
        setProducts(response.data);
        // Tri des produits par ordre aléatoire et en affiche un certain nombre selon l'écran
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
        setProductsFetched(true); 

        
        window.addEventListener('resize', updateProducts);
        return () => window.removeEventListener('resize', updateProducts);
      } catch (error) {
        console.error("Erreur lors de la récupération des produits :", error);
      }
    };

    fetchProducts();
  }, [productsFetched]);

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

      <ContactForm />
    </div>
  );
};

export default Home;
