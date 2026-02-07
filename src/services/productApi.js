import apiClient from '../lib/apiClient';

/**
 * Product API Service
 */
export const productApi = {
    /**
     * Get all products with optional filters
     */
    getProducts: async ({ category, search, page, limit } = {}) => {
        const params = new URLSearchParams();
        if (category && category !== 'All') params.append('category', category);
        if (search) params.append('search', search);
        if (page) params.append('page', page.toString());
        if (limit) params.append('limit', limit.toString());

        const query = params.toString();
        return apiClient.get(`/products${query ? `?${query}` : ''}`);
    },

    /**
     * Get single product by slug
     */
    getProduct: async (slug) => {
        return apiClient.get(`/products/${slug}`);
    },

    /**
     * Create new product (admin only)
     */
    createProduct: async (data) => {
        return apiClient.post('/products', data);
    },

    /**
     * Update product (admin only)
     */
    updateProduct: async (id, data) => {
        return apiClient.patch(`/products/${id}`, data);
    },

    /**
     * Delete product (admin only)
     */
    deleteProduct: async (id) => {
        return apiClient.delete(`/products/${id}`);
    },
};

export default productApi;
