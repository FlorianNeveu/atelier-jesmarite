import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import { useNavigate } from "react-router-dom";
import "../styles/Home.scss";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [randomProducts, setRandomProducts] = useState([]);
  const API_URL = process.env.API_URL || 'https://atelier-jesmarite-production.up.railway.app';
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
    navigate(`/products/${productId}`); // Redirige vers la page produit
  };

  return (
    <div className="home">
      <h1>Bienvenue sur l'Atelier de Jesmarite</h1>
      <h2>Découvrez notre sélection</h2>
      <div className="product-list">
        {randomProducts.map((product) => (
          <div key={product.id} className="product-card" onClick={() => handleProductClick(product.id)}>
            <h2>{product.name}</h2>
            <img src={`${API_URL}${product.image}`} alt={product.name} />
            <p>{product.description}</p>
            <p>{product.price} €</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
