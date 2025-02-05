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

const allowedOrigins = ['http://localhost:5173', 'https://atelier-jesmarite-production.up.railway.app', 'https://atelier-jesmarite.vercel.app', 'https://atelier-jesmarite-production.up.railway.app/create-checkout-session', 'https://atelier-jesmarite.vercel.app/create-checkout-session', 'https://checkout.stripe.com'];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || origin.startsWith('https://checkout.stripe.com/')) {
      callback(null, true); 
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Session-ID']
}));


app.use(express.json()); 
app.use(cookieParser()); 

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const YOUR_DOMAIN = 'https://atelier-jesmarite.vercel.app';

app.post('/create-checkout-session', async (req, res) => {
  const { cartItems } = req.body; 

  
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: cartItems.map(item => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.Product.name,
            images: [item.Product.image], 
          },
          unit_amount: item.Product.price * 100, 
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${YOUR_DOMAIN}/cancel`,
    });

    res.redirect(303, session.url);
  } catch (error) {
    console.error('Erreur lors de la création de la session de paiement :', error);
    res.status(500).json({ error: 'Erreur lors de la création de la session de paiement' });
  }
});

app.listen(5173, () => console.log('Running on port 5173'));


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
