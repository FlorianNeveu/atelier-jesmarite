const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv'); 
const sequelize = require('./config/db');
const cors = require('cors');
const path = require('path');
const Stripe = require('stripe')


dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')));

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

const allowedOrigins = ['http://localhost:5173', 'https://atelier-jesmarite-production.up.railway.app', 'https://atelier-jesmarite.vercel.app', 'http://localhost:5173'];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true); 
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));


app.use(express.json()); 
app.use(cookieParser()); 

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.post('/create-payment-intent', async (req, res) => {
  const { amount, currency, metadata } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency, 
      metadata, 
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Erreur lors de la création du paiement :', error);
    res.status(500).json({ error: 'Erreur lors de la création du paiement' });
  }
});


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
