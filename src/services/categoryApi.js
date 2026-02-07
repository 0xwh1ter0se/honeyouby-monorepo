import apiClient from '../lib/apiClient';

/**
 * Category API Service
 */
export const categoryApi = {
    getCategories: async () => {
        return apiClient.get('/categories');
    },

    createCategory: async (data) => {
        return apiClient.post('/categories', data);
    },

    updateCategory: async (id, data) => {
        return apiClient.patch(`/categories/${id}`, data);
    },

    deleteCategory: async (id) => {
        return apiClient.delete(`/categories/${id}`);
    },
};

export default categoryApi;
