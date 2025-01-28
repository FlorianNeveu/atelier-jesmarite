import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/products");
        console.log("Réponse de l'API :", response.data); // Log pour vérifier les données
        setProducts(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des produits :", error);
      }
    };
  
    fetchProducts();
  }, []);

  return (
    <div className="home">
      <h1>Bienvenue sur l'Atelier de Jesmarite</h1>
      <div className="product-list">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <h2>{product.name}</h2>
            <img src={`http://localhost:3001${product.image}`} alt={product.name} />
            <p>{product.description}</p>
            <p>{product.price} €</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;