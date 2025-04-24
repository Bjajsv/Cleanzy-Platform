import Stripe from 'stripe';
import { Order } from '../models/order.model';
import { Payment } from '../models/payment.model';
import { mpesaService } from '../services/mpesa.service';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const paymentController = {
    async createPaymentIntent(req, res) {
        try {
            const { amount, currency = 'USD', paymentMethodId } = req.body;

            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(amount * 100), // Convert to cents
                currency,
                payment_method: paymentMethodId,
                confirmation_method: 'manual',
                confirm: true,
                return_url: `${process.env.FRONTEND_URL}/checkout/complete`
            });

            await Payment.create({
                userId: req.user.id,
                amount,
                currency,
                paymentIntentId: paymentIntent.id,
                status: paymentIntent.status,
                paymentMethod: 'card'
            });

            res.json({
                clientSecret: paymentIntent.client_secret,
                status: paymentIntent.status
            });
        } catch (error) {
            console.error('Payment intent creation failed:', error);
            res.status(400).json({ error: error.message });
        }
    },

    async handleStripeWebhook(req, res) {
        const sig = req.headers['stripe-signature'];
        let event;

        try {
            event = stripe.webhooks.constructEvent(
                req.rawBody,
                sig,
                process.env.STRIPE_WEBHOOK_SECRET
            );
        } catch (err) {
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        switch (event.type) {
            case 'payment_intent.succeeded':
                await handlePaymentSuccess(event.data.object);
                break;
            case 'payment_intent.payment_failed':
                await handlePaymentFailure(event.data.object);
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        res.json({ received: true });
    }
}; 