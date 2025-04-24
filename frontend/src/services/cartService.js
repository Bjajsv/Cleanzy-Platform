import api from './api';

export const cartService = {
    async getCart() {
        const response = await api.get('/cart');
        return response.data;
    },

    async addToCart(productId, quantity = 1, options = {}) {
        const response = await api.post('/cart/items', {
            productId,
            quantity,
            ...options
        });
        return response.data;
    },

    async updateCartItem(itemId, quantity) {
        const response = await api.put(`/cart/items/${itemId}`, { quantity });
        return response.data;
    },

    async removeFromCart(itemId) {
        const response = await api.delete(`/cart/items/${itemId}`);
        return response.data;
    },

    async applyCoupon(code) {
        const response = await api.post('/cart/coupon', { code });
        return response.data;
    },

    async getShippingMethods() {
        const response = await api.get('/cart/shipping-methods');
        return response.data;
    },

    async setShippingMethod(methodId) {
        const response = await api.put('/cart/shipping-method', { methodId });
        return response.data;
    },

    async checkout(paymentDetails) {
        const response = await api.post('/orders', paymentDetails);
        return response.data;
    }
}; 