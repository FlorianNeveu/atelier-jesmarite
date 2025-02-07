// Composants pour le formulaire d'adresse dans le panier

import React from "react";
const cleanInput = (input) => {
  return input.replace(/[<&{}>]/g, '');
};

const AddressForm = ({ 
    shippingAddress, 
    setShippingAddress, 
    onClose 
  }) => (
    <div className="shipping-form">
      <h3>Adresse de livraison</h3>
      <div className="form-row">
        <input
          type="text"
          placeholder="Adresse ligne 1*"
          value={shippingAddress.address_line1}
          onChange={(e) => setShippingAddress(prev => ({
            ...prev, 
            address_line1: cleanInput(e.target.value)
          }))}
          required
        />
      </div>
      <div className="form-row">
        <input
          type="text"
          placeholder="Adresse ligne 2"
          value={shippingAddress.address_line2}
          onChange={(e) => setShippingAddress(prev => ({
            ...prev, 
            address_line2: cleanInput(e.target.value)
          }))}
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          placeholder="Code postal*"
          value={shippingAddress.postal_code}
          onChange={(e) => setShippingAddress(prev => ({
            ...prev, 
            postal_code: cleanInput(e.target.value)
          }))}
          required
        />
        <input
          type="text"
          placeholder="Ville*"
          value={shippingAddress.city}
          onChange={(e) => setShippingAddress(prev => ({
            ...prev, 
            city: cleanInput(e.target.value)
          }))}
          required
        />
      </div>
      <div className="form-row">
        <input
          type="tel"
          placeholder="Téléphone mobile"
          value={shippingAddress.mobile}
          onChange={(e) => setShippingAddress(prev => ({
            ...prev, 
            mobile: cleanInput(e.target.value)
          }))}
        />
      </div>
    </div>
  );

  export default AddressForm;