const express = require('express');
const app = express();
const port = 3000;
const sequelize = require('./config/db');
const User = require('./models/User');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

app.use(express.json());

app.use('/admin', userRoutes);
app.use('/products', productRoutes);
app.use('/products', productRoutes);
app.use('/products', productRoutes);
app.use('/products', productRoutes);
app.use('/products', productRoutes);
app.use('/products', productRoutes);
app.use('/products', productRoutes);
app.use('/products', productRoutes);
app.use('/products', productRoutes);

app.get('/', (req, res) => {
    res.send('Bienvenue l\'atelier de Jesmarite!');
});

app.listen(port, () => {
    console.log(`Le serveur fonctionne normalement sur le port : ${port}`)
});

sequelize.sync({ alter: true})
  .then(() => {
    console.log('Les tables ont été créées avec succès.');
  })
  .catch((error) => {
    console.error('Erreur lors de la synchronisation des tables :', error);
  });