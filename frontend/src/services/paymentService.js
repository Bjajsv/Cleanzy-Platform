import api from './api';

export const paymentService = {
    async createPaymentIntent(paymentDetails) {
        try {
            const response = await api.post('/payments/create-intent', paymentDetails);
            return response.data;
        } catch (error) {
            throw new Error('Failed to create payment intent');
        }
    },

    async initiateMpesaPayment(paymentDetails) {
        try {
            const response = await api.post('/payments/mpesa/initiate', paymentDetails);
            return response.data;
        } catch (error) {
            throw new Error('Failed to initiate M-Pesa payment');
        }
    },

    async verifyMpesaPayment(transactionId) {
        try {
            const response = await api.get(`/payments/mpesa/verify/${transactionId}`);
            return response.data;
        } catch (error) {
            throw new Error('Failed to verify M-Pesa payment');
        }
    },

    async getPaymentMethods() {
        try {
            const response = await api.get('/payments/methods');
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch payment methods');
        }
    },

    async savePaymentMethod(paymentMethod) {
        try {
            const response = await api.post('/payments/methods', paymentMethod);
            return response.data;
        } catch (error) {
            throw new Error('Failed to save payment method');
        }
    }
}; 