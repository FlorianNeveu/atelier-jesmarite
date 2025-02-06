import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import ProductCard from "../components/ProductCard";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.API_URL || 'https://atelier-jesmarite-production.up.railway.app';

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

  if (loading) return <p>Chargement des produits...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="products">
      <h1>Tous nos produits</h1>
      <div className="product-list">
        {products.map((product) => (
          <ProductCard key={product.id} product={product}  />
        ))}
      </div>
    </div>
  );
};

export default Products;
