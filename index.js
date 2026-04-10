const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/* =========================
HEALTH CHECK
========================= */
app.get('/', (req, res) => {
    res.json({ status: 'Stripe backend running' });
});

/* =========================
CREATE PAYMENT
========================= */
app.post('/charge', async (req, res) => {
    try {

        const { amount, payment_method } = req.body;

      const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: 'usd',
    payment_method: payment_method,
    confirm: true,

    automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
    }
});

        res.json({
            success: true,
            id: paymentIntent.id
        });

    } catch (err) {
        res.json({
            success: false,
            error: err.message
        });
    }
});

app.listen(3000, () => {
    console.log('Stripe backend running');
});
