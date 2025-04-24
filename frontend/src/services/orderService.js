import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

class OrderService {
    constructor() {
        this.api = axios.create({
            baseURL: `${API_URL}/api/orders`,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Add auth token to requests
        this.api.interceptors.request.use((config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });
    }

    async createOrder(orderData) {
        const response = await this.api.post('/', orderData);
        return response.data;
    }

    async getOrderById(orderId) {
        const response = await this.api.get(`/${orderId}`);
        return response.data;
    }

    async getMyOrders() {
        const response = await this.api.get('/my-orders');
        return response.data;
    }

    async updateOrderToPaid(orderId, paymentResult) {
        const response = await this.api.patch(`/${orderId}/pay`, paymentResult);
        return response.data;
    }

    async initiatePayment(orderId, paymentMethod, phoneNumber) {
        const response = await this.api.post(`/${orderId}/pay/initiate`, {
            paymentMethod,
            phoneNumber
        });
        return response.data;
    }

    async verifyPayment(orderId, paymentId) {
        const response = await this.api.get(`/${orderId}/pay/verify/${paymentId}`);
        return response.data;
    }

    async cancelOrder(orderId, cancellationDetails) {
        try {
            const response = await this.api.post(`/orders/${orderId}/cancel`, cancellationDetails);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to cancel order');
        }
    }

    async getCancellationEligibility(orderId) {
        try {
            const response = await this.api.get(`/orders/${orderId}/cancellation-eligibility`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to check cancellation eligibility');
        }
    }
}

export const orderService = new OrderService(); 