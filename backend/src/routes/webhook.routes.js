import express from 'express';
import { paymentController } from '../controllers/payment.controller';
import { validateWebhook } from '../middleware/webhook.middleware';
import { Payment } from '../models/payment.model';
import { Order } from '../models/order.model';

const router = express.Router();

router.post(
    '/stripe',
    express.raw({ type: 'application/json' }),
    validateWebhook,
    paymentController.handleStripeWebhook
);

router.post(
    '/mpesa',
    express.json(),
    async (req, res) => {
        try {
            const {
                Body: {
                    stkCallback: {
                        MerchantRequestID,
                        CheckoutRequestID,
                        ResultCode,
                        ResultDesc,
                        CallbackMetadata
                    }
                }
            } = req.body;

            if (ResultCode === 0) {
                // Payment successful
                const payment = await Payment.findOne({
                    merchantRequestId: MerchantRequestID
                });

                if (payment) {
                    payment.status = 'completed';
                    payment.transactionId = CallbackMetadata.find(
                        item => item.Name === 'MpesaReceiptNumber'
                    ).Value;
                    await payment.save();

                    // Update order status
                    await Order.findByIdAndUpdate(
                        payment.orderId,
                        { status: 'paid' }
                    );
                }
            }

            res.json({ ResultCode: 0, ResultDesc: 'Success' });
        } catch (error) {
            console.error('M-Pesa webhook processing failed:', error);
            res.status(500).json({ error: 'Webhook processing failed' });
        }
    }
);

export default router; 