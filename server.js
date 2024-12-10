const express = require('express');
const app = express();
const port = 3000;
const sequelize = require('./config/db');
const User = require('./models/User');



app.use(express.json());

app.get('/', (req, res) => {
    res.send('Bienvenue l\'atelier de Jesmarite!');
});

app.listen(port, () => {
    console.log(`Le serveur fonctionne normalement sur le port : ${port}`)
});

sequelize.sync({ force: true })
  .then(() => {
    console.log('Les tables ont été créées avec succès.');
  })
  .catch((error) => {
    console.error('Erreur lors de la synchronisation des tables :', error);
  });