import apiClient from '../lib/apiClient';

/**
 * Order API Service
 */
export const orderApi = {
    /**
     * Create a new order (checkout)
     */
    createOrder: async (orderData) => {
        return apiClient.post('/orders', orderData);
    },

    /**
     * Get current user's orders
     */
    getMyOrders: async () => {
        return apiClient.get('/orders');
    },

    /**
     * Get order by ID
     */
    getOrder: async (id) => {
        return apiClient.get(`/orders/${id}`);
    },

    /**
     * Get all orders (admin only)
     */
    getAllOrders: async () => {
        return apiClient.get('/orders/admin/all');
    },

    /**
     * Update order status (admin only)
     */
    updateOrderStatus: async (id, status) => {
        return apiClient.patch(`/orders/${id}/status`, { status });
    },

    /**
     * Mark order as received (Customer)
     */
    receiveOrder: async (id) => {
        return apiClient.patch(`/orders/${id}/receive`);
    },

    /**
     * Submit order rating (Customer)
     */
    submitRating: async (id, ratingData) => {
        return apiClient.post(`/orders/${id}/rating`, ratingData);
    },
};

export default orderApi;
