import apiClient from '../lib/apiClient';

/**
 * Review API Service
 */
export const reviewApi = {
    /**
     * Get reviews for a product
     */
    getProductReviews: async (productId) => {
        return apiClient.get(`/reviews/products/${productId}/reviews`);
    },

    /**
     * Create a review for a product
     */
    createReview: async (productId, data) => {
        return apiClient.post(`/reviews/products/${productId}/reviews`, data);
    },

    /**
     * Get all pending reviews (admin only)
     */
    getPendingReviews: async () => {
        return apiClient.get('/reviews/admin/pending');
    },

    /**
     * Approve a review (admin only)
     */
    approveReview: async (id) => {
        return apiClient.patch(`/reviews/${id}/approve`);
    },

    /**
     * Delete a review (admin only)
     */
    deleteReview: async (id) => {
        return apiClient.delete(`/reviews/${id}`);
    },
};

export default reviewApi;
