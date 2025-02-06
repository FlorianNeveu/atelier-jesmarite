import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import { useParams, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const CollectionsDetail = () => {
  const { categoryId } = useParams(); 
  const [products, setProducts] = useState([]);
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {

        const collectionResponse = await axiosInstance.get(`/categories/${categoryId}`);
        setCollection(collectionResponse.data);

        const response = await axiosInstance.get(`/products/category/${categoryId}`);
        setProducts(response.data);

        setError(null);
      } catch (error) {
        console.error("Erreur :", error);
        setError("Impossible de charger les produits");
      } finally {
        setLoading(false);
      }
    };

    fetchProductsByCategory();
  }, [categoryId]); 

  if (loading) return <div className="loading">Chargement...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="collections-detail">
      {collection && (
        <>
          <h1>{collection.name}</h1>
          <p className="collection-description">{collection.description}</p>
        </>
      )}
      
      <div className="product-grid-collection">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="empty-message">Aucun produit dans cette collection</p>
        )}
      </div>
    </div>
  );
};

export default CollectionsDetail;