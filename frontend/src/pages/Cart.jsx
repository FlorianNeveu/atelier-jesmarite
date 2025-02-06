import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const sessionId = localStorage.getItem("sessionId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!sessionId) {
        console.warn("⚠️ Pas de sessionId disponible !");
        return;
      }

      try {
        const response = await axiosInstance.get(`/carts/${sessionId}`);
        
        if (Array.isArray(response.data)) {
          setCartItems(response.data);
        } else {
          setCartItems([]);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du panier :", error);
        setCartItems([]);
      }
    };

    fetchCartItems();
  }, [sessionId]);

  const calculateTotalAmount = () => {
    return cartItems.reduce((total, item) => {
      if (item.Product && item.Product.price) {
        return total + (item.quantity * item.Product.price);
      }
      return total;
    }, 0);
  };

  const handleQuantityChange = async (productId, newQuantity) => {

    if (isNaN(newQuantity) || newQuantity < 1) {
      alert("Quantité invalide (minimum 1)");
      return;
    }
  
    try {
      const response = await axiosInstance.put(`/carts/${sessionId}/update`, {
        product_id: productId,
        quantity: newQuantity
      });
  
      setCartItems(prev => prev.map(item => 
        item.Product.id === productId ? response.data : item
      ));
  
    } catch (error) {
      console.error("Erreur :", error);
      alert("Erreur lors de la mise à jour");
    }
  };

  const handleRemoveProduct = async (productId) => {
    if (!window.confirm('Confirmer la suppression ?')) return;

    try {
      await axiosInstance.delete(`/carts/${sessionId}/product/${productId}`);
      setCartItems(cartItems.filter(item => item.Product.id !== productId));
    } catch (error) {
      console.error("Erreur lors de la suppression du produit :", error);
    }
  };

  const handleCheckout = async () => {
    try {
      const response = await axiosInstance.post('/create-checkout-session', { cartItems });
      window.location.href = response.data.url;
    } catch (error) {
      console.error("Erreur lors de la création de la session Stripe :", error);
    }
  };

  return (
    <div className="cart">
      <h1>Votre Panier</h1>
      
      {cartItems.length === 0 ? (
        <p>Votre panier est vide.</p>
      ) : (
        <div className="cart-items">
          {Array.isArray(cartItems) && cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <div key={index} className={`cart-item ${index % 2 === 0 ? "even" : "odd"}`}>
                {item.Product ? (
                  <div className="product-details">
                    <div className="product-image">
                      <img src={item.Product.image} alt={item.Product.name} />
                    </div>
                    <div className="product-info">
                      <h2>{item.Product.name}</h2>
                      <p>Quantité : 
                        <input 
                          type="number" 
                          value={item.quantity} 
                          min="1"
                          onChange={(e) => handleQuantityChange(item.Product.id, parseInt(e.target.value))}
                        />
                      </p>
                      <p>Prix unitaire : {item.Product.price} €</p>
                      <p>Total : {item.quantity * item.Product.price} €</p>
                      <button onClick={() => handleRemoveProduct(item.Product.id)}>
                        Supprimer
                      </button>
                    </div>
                  </div>
                ) : (
                  <p>Produit indisponible</p>
                )}
              </div>
            ))
          ) : (
            <p>Aucun produit dans le panier</p>
          )}
        </div>
      )}

      {cartItems.length > 0 && (
        <div className="total-section">
          <h3>Total : {calculateTotalAmount()} €</h3>
          <button onClick={handleCheckout}>Passer au paiement</button>
        </div>
      )}
    </div>
  );
};

export default Cart;
