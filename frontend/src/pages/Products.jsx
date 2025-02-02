import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = process.env.API_URL;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/products");
        setProducts(response.data);
      } catch (err) {
        setError("Erreur lors de la récupération des produits.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    const sessionId = localStorage.getItem("sessionId"); 
        // Set loading to false once the fetch is complete

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

  if (loading) return <p>Chargement des produits...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="products">
      <h1>Tous nos produits</h1>
      <div className="product-list">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <h2>{product.name}</h2>
            <img src={`${API_URL}${product.image}`} alt={product.name} />
            <p>{product.description}</p>
            <p>Prix : {product.price} €</p>
            <button onClick={() => handleAddToCart(product.id)}>Ajouter au panier</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
