const axios = require('axios');
const AppError = require('../utils/appError');

class PaymentService {
    constructor() {
        this.mpesaConfig = {
            consumerKey: process.env.MPESA_CONSUMER_KEY,
            consumerSecret: process.env.MPESA_CONSUMER_SECRET,
            passkey: process.env.MPESA_PASSKEY,
            shortcode: process.env.MPESA_SHORTCODE,
            callbackUrl: `${process.env.BACKEND_URL}/api/payments/mpesa/callback`
        };
        
        this.paypalConfig = {
            clientId: process.env.PAYPAL_CLIENT_ID,
            clientSecret: process.env.PAYPAL_CLIENT_SECRET,
            mode: process.env.NODE_ENV === 'production' ? 'live' : 'sandbox'
        };
    }

    async generateMpesaToken() {
        try {
            const auth = Buffer.from(
                `${this.mpesaConfig.consumerKey}:${this.mpesaConfig.consumerSecret}`
            ).toString('base64');

            const response = await axios.get(
                'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
                {
                    headers: {
                        Authorization: `Basic ${auth}`
                    }
                }
            );

            return response.data.access_token;
        } catch (error) {
            throw new AppError('Failed to generate M-Pesa token', 500);
        }
    }

    async initiateSTKPush(phoneNumber, amount, orderId) {
        try {
            const token = await this.generateMpesaToken();
            const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
            const password = Buffer.from(
                `${this.mpesaConfig.shortcode}${this.mpesaConfig.passkey}${timestamp}`
            ).toString('base64');

            const response = await axios.post(
                'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
                {
                    BusinessShortCode: this.mpesaConfig.shortcode,
                    Password: password,
                    Timestamp: timestamp,
                    TransactionType: 'CustomerPayBillOnline',
                    Amount: amount,
                    PartyA: phoneNumber,
                    PartyB: this.mpesaConfig.shortcode,
                    PhoneNumber: phoneNumber,
                    CallBackURL: this.mpesaConfig.callbackUrl,
                    AccountReference: orderId,
                    TransactionDesc: `Payment for order ${orderId}`
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            return response.data;
        } catch (error) {
            throw new AppError('Failed to initiate M-Pesa payment', 500);
        }
    }

    async createPayPalOrder(items, orderId) {
        try {
            const order = {
                intent: 'CAPTURE',
                purchase_units: [{
                    reference_id: orderId,
                    amount: {
                        currency_code: 'USD',
                        value: items.reduce((sum, item) => sum + item.price * item.quantity, 0)
                            .toFixed(2)
                    },
                    items: items.map(item => ({
                        name: item.name,
                        quantity: item.quantity,
                        unit_amount: {
                            currency_code: 'USD',
                            value: item.price.toFixed(2)
                        }
                    }))
                }],
                application_context: {
                    return_url: `${process.env.FRONTEND_URL}/payment/success`,
                    cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`
                }
            };

            const response = await axios.post(
                'https://api-m.sandbox.paypal.com/v2/checkout/orders',
                order,
                {
                    auth: {
                        username: this.paypalConfig.clientId,
                        password: this.paypalConfig.clientSecret
                    }
                }
            );

            return response.data;
        } catch (error) {
            throw new AppError('Failed to create PayPal order', 500);
        }
    }

    async capturePayPalPayment(orderId) {
        try {
            const response = await axios.post(
                `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`,
                {},
                {
                    auth: {
                        username: this.paypalConfig.clientId,
                        password: this.paypalConfig.clientSecret
                    }
                }
            );

            return response.data;
        } catch (error) {
            throw new AppError('Failed to capture PayPal payment', 500);
        }
    }
}

module.exports = new PaymentService(); 