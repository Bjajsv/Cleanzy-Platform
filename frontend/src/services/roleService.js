import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

class RoleService {
    constructor() {
        this.api = axios.create({
            baseURL: `${API_URL}/api/roles`,
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

    async getAllRoles() {
        const response = await this.api.get('/');
        return response.data;
    }

    async getRole(id) {
        const response = await this.api.get(`/${id}`);
        return response.data;
    }

    async createRole(roleData) {
        const response = await this.api.post('/', roleData);
        return response.data;
    }

    async updateRole(id, roleData) {
        const response = await this.api.put(`/${id}`, roleData);
        return response.data;
    }

    async deleteRole(id) {
        const response = await this.api.delete(`/${id}`);
        return response.data;
    }

    async assignRoleToUser(userId, roleId) {
        const response = await this.api.post(`/assign`, { userId, roleId });
        return response.data;
    }

    async getRolePermissions(roleId) {
        const response = await this.api.get(`/${roleId}/permissions`);
        return response.data;
    }
}

export const roleService = new RoleService(); 