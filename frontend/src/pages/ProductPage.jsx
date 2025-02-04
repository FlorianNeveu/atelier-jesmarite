import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../axiosConfig";

const ProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const API_URL = import.meta.env.API_URL || 'https://atelier-jesmarite-production.up.railway.app';

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/products/${productId}`);
        setProduct(response.data);
      } catch (error) {
        setError("Ce produit n'existe pas ou est indisponible.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

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

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;
  if (!product) return <div>Aucun produit trouvé.</div>;

  return (
    <div>
      <h1>{product.name}</h1>
      <img src={`${product.image}`} alt={product.name} />
      <p>{product.description}</p>
      <p>{product.price} €</p>
      <button onClick={() => handleAddToCart(product.id)}>Ajouter au panier</button>
    </div>
  );
};

export default ProductPage;