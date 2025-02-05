import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig"; // Assure-toi d'utiliser l'instance d'axios
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const sessionId = localStorage.getItem("sessionId"); // Récupérer le sessionId dans localStorage
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!sessionId) {
        console.warn("⚠️ Pas de sessionId disponible !");
        return;
      }

      try {
        const response = await axiosInstance.get(`/carts/${sessionId}`);
        setCartItems(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération du panier :", error);
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

  const handleCheckout = async () => {
    try {
      // Envoie les éléments du panier au backend pour créer la session de paiement
      const response = await axiosInstance.post('/create-checkout-session', { cartItems });

      // Stripe redirige automatiquement l'utilisateur vers la page de paiement
      window.location.href = response.data.url; // Rediriger vers l'URL de la session Stripe
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
        <ul>
          {cartItems.map((item, index) => (
            <li key={index}>
              {/* Vérifie que item.Product existe avant d'afficher ses informations */}
              {item.Product ? (
                <>
                  <h2>{item.Product.name}</h2>
                  <img src={item.Product.image} alt={item.Product.name} />
                  <p>Quantité : {item.quantity}</p>
                  <p>Prix unitaire : {item.Product.price} €</p>
                  <p>Total : {item.quantity * item.Product.price} €</p>
                </>
              ) : (
                <p>Produit indisponible</p>
              )}
            </li>
          ))}
        </ul>
      )}
      {cartItems.length > 0 && (
        <div>
          <h3>Total : {calculateTotalAmount()} €</h3>
          <button onClick={handleCheckout}>Passer au paiement</button>
        </div>
      )}
    </div>
  );
};

export default Cart;
