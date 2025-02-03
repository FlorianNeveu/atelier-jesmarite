import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../axiosConfig";

const ProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const API_URL = process.env.API_URL || 'https://atelier-jesmarite-production.up.railway.app';

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

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;
  if (!product) return <div>Aucun produit trouvé.</div>;

  return (
    <div>
      <h1>{product.name}</h1>
      <img src={`${API_URL}${product.image}`} alt={product.name} />
      <p>{product.description}</p>
      <p>{product.price} €</p>
      <button>Ajouter au panier</button>
    </div>
  );
};

export default ProductPage;