import apiClient from '../lib/apiClient';

/**
 * Carousel API Service
 */
export const carouselApi = {
    /**
     * Get all active carousels
     */
    getCarousels: async () => {
        return apiClient.get('/carousels');
    },

    /**
     * Get all carousels (admin only)
     */
    getAllCarousels: async () => {
        return apiClient.get('/carousels/admin/all');
    },

    /**
     * Create carousel (admin only)
     */
    createCarousel: async (data) => {
        return apiClient.post('/carousels', data);
    },

    /**
     * Update carousel (admin only)
     */
    updateCarousel: async (id, data) => {
        return apiClient.patch(`/carousels/${id}`, data);
    },

    /**
     * Delete carousel (admin only)
     */
    deleteCarousel: async (id) => {
        return apiClient.delete(`/carousels/${id}`);
    },
};

export default carouselApi;
