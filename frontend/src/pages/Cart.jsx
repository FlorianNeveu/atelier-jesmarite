import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const sessionId = localStorage.getItem("sessionId");

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!sessionId) {
        console.warn("⚠️ Pas de sessionId disponible !");
        return;
      }

      try {
        console.log(`Requête envoyée : /carts/${sessionId}`);
        const response = await axiosInstance.get(`/carts/${sessionId}`);
        console.log("Réponse reçue :", response.data);

        setCartItems(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération du panier :", error);
      }
    };

    fetchCartItems();
  }, [sessionId]);

  return (
    <div className="cart">
      <h1>Votre Panier</h1>
      {cartItems.length === 0 ? (
        <p>Votre panier est vide.</p>
      ) : (
        <ul>
          {cartItems.map((item, index) => (
            <li key={index}>
              <h2>{item.Product?.name}</h2>
              <img src={`http://localhost:3001${item.Product?.image}`} alt={item.Product?.name} />
              <p>Quantité : {item.quantity}</p>
              <p>Prix unitaire : {item.Product?.price} €</p>
              <p>Total : {item.quantity * item.Product?.price} €</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Cart;
