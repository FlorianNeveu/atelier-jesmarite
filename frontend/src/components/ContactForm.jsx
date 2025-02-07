import React from "react";

const cleanInput = (input) => {
  return input.replace(/[<&{}>]/g, '');
};

const ContactForm = () => {
  return (
    <div className="contact-section">
      <h3>Pour une commande personnalisée ou une question ? Contactez-nous</h3>
      <form action="https://formspree.io/f/mnnjzdzv" method="POST" target='_blank'>
        <div className="left-column">
          <input type="text" name="name" placeholder="Votre nom" required />
          <input type="email" name="email" placeholder="Votre email" required />
        </div>
        <div className="right-column">
          <textarea name="message" placeholder="Votre message" rows="5" required></textarea>
          <button type="submit">Envoyer</button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
