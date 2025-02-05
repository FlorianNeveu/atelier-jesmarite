import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import { useParams, useNavigate } from "react-router-dom";

const CollectionsDetail = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        const response = await axiosInstance.get(`/products/category/${id}`);
        setProducts(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des produits de la catégorie :", error);
      }
    };

    fetchProductsByCategory();
  }, [id]);

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  return (
    <div className="collections-detail">
      <h1>Produits de la collection</h1>
      <div className="product-list">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => handleProductClick(product.id)}
            >
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>{product.price} €</p>
            </div>
          ))
        ) : (
          <p>Aucun produit trouvé pour cette collection.</p>
        )}
      </div>
    </div>
  );
};

export default CollectionsDetail;
