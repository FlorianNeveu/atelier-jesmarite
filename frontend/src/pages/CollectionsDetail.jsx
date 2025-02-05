import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import { useParams, useNavigate } from "react-router-dom";

const CollectionsDetail = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        const response = await axiosInstance.get(`/products?category_id=${id}`);
        setProducts(response.data);
        setError(null);
      } catch (error) {
        console.error("Erreur lors de la récupération des produits :", error);
        setError("Impossible de charger les produits");
      } finally {
        setLoading(false);
      }
    };

    fetchProductsByCategory();
  }, [id]);

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  if (loading) return <div className="loading">Chargement en cours...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="collections-detail">
      <h1>Collection</h1>
      <div className="product-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => handleProductClick(product.id)}
            >
              <div className="image-container">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  loading="lazy"
                />
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="price">{product.price} €</p>
              </div>
            </div>
          ))
        ) : (
          <p className="empty-message">Aucun produit dans cette collection</p>
        )}
      </div>
    </div>
  );
};

export default CollectionsDetail;