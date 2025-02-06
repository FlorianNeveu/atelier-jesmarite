import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../axiosConfig";

const Collections = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/categories/");
        setCategories(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des collections :", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCollectionClick = (categoryId) => {
    navigate(`/collections/${categoryId}`);
  };

  return (
    <div className="collections">
      <h1>Nos Collections</h1>
      <div className="collections-list">
        {categories.map((category) => (
          <div
            key={category.id}
            className="category-card"
            onClick={() => handleCollectionClick(category.id)}
          >
            <h2>{category.name}</h2>
            <p>{category.description}</p>
          </div>
        ))}
      </div>
      <div className="view-all-btn-container">
        <Link to="/products" className="view-all-btn">Voir tous les produits</Link>
      </div>
    </div>
  );
};

export default Collections;
