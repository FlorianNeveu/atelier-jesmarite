import React from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';  // Assure-toi d'avoir axiosInstance configuré pour ton API

const ProductCard = ({ product, handleAddToCart }) => {
  const navigate = useNavigate();

  // Fonction pour rediriger vers la page du produit
  const handleProductClick = () => {
    navigate(`/products/${product.id}`);
  };

  // Fonction pour ajouter au panier
  const handleAddToCartClick = async () => {
    const sessionId = localStorage.getItem("sessionId");

    try {
      await axiosInstance.post("/carts", {
        product_id: product.id,
        quantity: 1,
        session_id: sessionId,
      });
      alert("Produit ajouté au panier !");
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier :", error);
    }
  };

  return (
    <div className="product-card" onClick={handleProductClick}>
      <div className="image-container">
        <img src={product.image} alt={product.name} loading="lazy" />
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="price">{product.price} €</p>
        <button onClick={(e) => { 
          e.stopPropagation(); 
          handleAddToCartClick();
        }}>
          Ajouter au panier
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
