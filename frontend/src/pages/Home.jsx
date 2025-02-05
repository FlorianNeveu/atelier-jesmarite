import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import { useNavigate } from "react-router-dom";
import "../styles/Home.scss";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [randomProducts, setRandomProducts] = useState([]);
  const API_URL = import.meta.env.API_URL || 'https://atelier-jesmarite-production.up.railway.app';
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/products");
        setProducts(response.data);

        const selectedProducts = response.data.sort(() => Math.random() - 0.5); 
        setRandomProducts(selectedProducts.slice(0, window.innerWidth <= 768 ? 2 : 4));
      } catch (error) {
        console.error("Erreur lors de la récupération des produits :", error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    const sessionId = localStorage.getItem("sessionId");

    try {
      await axiosInstance.post("/carts", {
        product_id: productId,
        quantity: 1,
        session_id: sessionId,
      });
      alert("Produit ajouté au panier !");
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier :", error);
    }
  };

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

      <div style={{ backgroundImage: `url('https://example.com/your-image.jpg')` }}>
        <div>
          <h2 onClick={handleCollectionsClick} className="hero-text">
            Découvrez nos collections
          </h2>
          <button onClick={handleInstagramClick} className="instagram-btn">
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram Logo" />
          </button>
        </div>
      </div>

      <h1>Bienvenue sur l'Atelier de Jesmarite</h1>
      <h2>Découvrez notre sélection</h2>
      <div className="product-list">
        {randomProducts.map((product) => (
          <div key={product.id} className="product-card" onClick={() => handleProductClick(product.id)}>
            <h2>{product.name}</h2>
            <img src={`${product.image}`} alt={product.name} />
            <p>{product.description}</p>
            <p>{product.price} €</p>
          </div>
        ))}
      </div>
      <button className="view-all-btn"onClick={handleViewAllProducts}>Voir tous</button>
      <div className="intro-block">
        <h3>Découvrez L'Atelier de Jesmarite</h3>
        <p>
          La Jesmonite est un matériau innovant et écologique, utilisé pour créer des œuvres
          d'art et des objets décoratifs. Sa flexibilité et sa rapidité de prise en font un
          choix idéal pour des créations personnalisées et uniques.
        </p>
        <button className="learn-more-btn" onClick={handleLearnMore}>En savoir plus</button>
      </div>
    </div>
  );
};

export default Home;
