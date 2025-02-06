const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv'); 
const sequelize = require('./config/db');
const cors = require('cors');
const path = require('path');
const Stripe = require('stripe')

const router = express.Router();


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
  try {
    const { cartItems, shippingAddress } = req.body;

    // Validation des données
    if (!cartItems?.length) throw new Error('Panier vide');
    if (!shippingAddress?.address_line1 || !shippingAddress?.city || !shippingAddress?.postal_code) {
      throw new Error('Adresse incomplète');
    }

    const line_items = cartItems.map(item => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${CLIENT_URL}/cancel`,
      shipping_address_collection: {
        allowed_countries: ['FR'],
      },
    });

    res.json({ url: session.url });
    
  } catch (error) {
    console.error('Erreur serveur:', error);
    res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.get('/get-shipping-address/:sessionId', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
    
    const stripeAddress = session.shipping.address;
    
    const address = await UserAddress.findOne({ 
      where: { session_id: session.id }
    });
    
    await address.update({
      address_line1: stripeAddress.line1,
      address_line2: stripeAddress.line2,
      city: stripeAddress.city,
      postal_code: stripeAddress.postal_code,
      country: stripeAddress.country
    });

    res.json(address);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
