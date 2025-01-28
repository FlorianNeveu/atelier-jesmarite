import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          <div key={product.id} className="product-card">
            <h2>{product.name}</h2>
            <img src={`http://localhost:3001${product.image}`} alt={product.name} />
            <p>{product.description}</p>
            <p>Prix : {product.price} €</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;

