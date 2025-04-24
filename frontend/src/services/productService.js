import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

class ProductService {
    constructor() {
        this.api = axios.create({
            baseURL: `${API_URL}/api/products`,
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

    async getAllProducts(params = {}) {
        const response = await this.api.get('/', { params });
        return response.data;
    }

    async getProductById(id) {
        const response = await this.api.get(`/${id}`);
        return response.data;
    }

    async createProduct(productData) {
        const response = await this.api.post('/', productData);
        return response.data;
    }

    async updateProduct(id, productData) {
        const response = await this.api.put(`/${id}`, productData);
        return response.data;
    }

    async deleteProduct(id) {
        const response = await this.api.delete(`/${id}`);
        return response.data;
    }

    async updateProductStock(id, quantity) {
        const response = await this.api.patch(`/${id}/stock`, { quantity });
        return response.data;
    }

    async getRecommendations({ categories, currentItems, limit = 4 }) {
        try {
            const response = await this.api.post('/recommendations', {
                categories,
                currentItems,
                limit
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            throw error;
        }
    }

    uploadProductImage: async (formData, onUploadProgress) => {
        return await this.api.post('/products/images', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent) => {
                onUploadProgress && onUploadProgress(progressEvent);
            }
        });
    },

    deleteProductImage: async (productId, imageId) => {
        return await this.api.delete(`/products/${productId}/images/${imageId}`);
    },

    setMainProductImage: async (productId, imageId) => {
        return await this.api.patch(`/products/${productId}/images/${imageId}/main`);
    }
}

export const productService = new ProductService(); 