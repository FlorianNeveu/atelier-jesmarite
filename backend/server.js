const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv'); 
const sequelize = require('./config/db');
const cors = require('cors');
const path = require('path');


dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

require("./models/associations");

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const cartRoutes = require('./routes/cartRoutes');
const addressRoutes = require('./routes/userAddressRoutes');
const productCategoryRoutes = require('./routes/productCategoryRoutes');
const adminRoutes = require('./routes/adminRoutes');
const shoppingSessionRoutes = require('./routes/shoppingSessionRoutes');
const userPaymentRoutes = require('./routes/userPaymentRoutes');
const authRoutes = require('./routes/authRoutes');

const allowedOrigins = 'https://atelier-jesmarite-production.up.railway.app';

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS'));
    }
  },
  credentials: true,
  exposedHeaders: ['set-cookie'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Session-ID']
}));


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Private-Network', 'true');
  res.header('Permissions-Policy', 'interest-cohort=()');
  next();
});


app.use(express.json()); 
app.use(cookieParser()); 


app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/payments', paymentRoutes);
app.use('/carts', cartRoutes);
app.use('/addresses', addressRoutes);
app.use('/categories', productCategoryRoutes);
app.use('/admins', adminRoutes);
app.use('/sessions', shoppingSessionRoutes);
app.use('/userpayments', userPaymentRoutes);
app.use('/auth', authRoutes); 

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => {
    res.send("Bienvenue sur l'atelier de Jesmarite !");
});

app.listen(port, () => {
    console.log(`Le serveur fonctionne normalement sur le port : ${port}`);
});


sequelize.sync({ alter: true })
  .then(() => {
    console.log('Les tables ont été créées avec succès.');
  })
  .catch((error) => {
    console.error('Erreur lors de la synchronisation des tables :', error);
  });
