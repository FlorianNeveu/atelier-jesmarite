import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy">
      <h1>Politique de confidentialité</h1>
      
      <section>
        <h2>ARTICLE 1 : PRÉAMBULE</h2>
        <p>
          La présente politique de confidentialité a pour but d'informer les utilisateurs du site : 
          [Nom du site/de l’application]
        </p>
        <ul>
          <li>Sur la manière dont sont collectées leurs données personnelles.</li>
          <li>Sur les droits dont ils disposent concernant ces données.</li>
          <li>Sur la personne responsable du traitement des données.</li>
          <li>Sur les destinataires de ces données personnelles.</li>
          <li>Sur la politique du site en matière de cookies.</li>
        </ul>
      </section>
      
      <section>
        <h2>ARTICLE 2 : PRINCIPES RELATIFS À LA COLLECTE ET AU TRAITEMENT DES DONNÉES PERSONNELLES</h2>
        <p>
          Conformément à l’article 5 du Règlement européen 2016/679, les données à caractère personnel sont : 
        </p>
        <ul>
          <li>Traitées de manière licite, loyale et transparente.</li>
          <li>Collectées pour des finalités légitimes.</li>
          <li>Adéquates et pertinentes.</li>
          <li>Exactes et mises à jour si nécessaire.</li>
          <li>Conservées pendant une durée nécessaire.</li>
          <li>Traitées avec des mesures de sécurité appropriées.</li>
        </ul>
      </section>
      
      <section>
        <h2>ARTICLE 3 : DONNÉES À CARACTÈRE PERSONNEL COLLECTÉES</h2>
        <h3>Article 3.1 : Données collectées</h3>
        <p>
          Les données personnelles collectées dans le cadre de notre activité sont les suivantes : 
          [Listez les données collectées].
        </p>

        <h3>Article 3.2 : Mode de collecte des données</h3>
        <p>
          Lors de l’utilisation de notre site, certaines données sont automatiquement collectées. 
          [Listez les données collectées].
        </p>

        <h3>Article 3.3 : Hébergement des données</h3>
        <p>
          Le site [nom du site web] est hébergé par : [Dénomination sociale de l’entreprise].
        </p>
      </section>
      
      <section>
        <h2>ARTICLE 4 : RESPONSABLE DU TRAITEMENT DES DONNÉES</h2>
        <p>
          Les données sont collectées par [nom de l’entreprise]. Vous pouvez nous contacter à :
        </p>
        <ul>
          <li>Adresse : [adresse]</li>
          <li>Email : [email]</li>
          <li>Téléphone : [numéro]</li>
        </ul>
      </section>

      <section>
        <h2>ARTICLE 5 : DROITS DE L’UTILISATEUR</h2>
        <p>
          Tout utilisateur peut exercer ses droits concernant ses données personnelles en envoyant une demande à [email].
        </p>
      </section>

      <section>
        <h2>ARTICLE 6 : MODIFICATIONS DE LA POLITIQUE DE CONFIDENTIALITÉ</h2>
        <p>
          Cette politique peut être modifiée à tout moment, et les utilisateurs doivent en prendre connaissance régulièrement.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
