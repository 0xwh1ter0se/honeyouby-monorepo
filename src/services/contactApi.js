import apiClient from '../lib/apiClient';

/**
 * Contact API Service
 */
export const contactApi = {
    /**
     * Submit a contact message
     */
    sendMessage: async (data) => {
        return apiClient.post('/contact', data);
    },

    /**
     * Get all contact messages (admin only)
     */
    getMessages: async () => {
        return apiClient.get('/contact/admin');
    },

    /**
     * Mark message as read (admin only)
     */
    markAsRead: async (id) => {
        return apiClient.patch(`/contact/${id}/read`);
    },

    /**
     * Delete message (admin only)
     */
    deleteMessage: async (id) => {
        return apiClient.delete(`/contact/${id}`);
    },
};

export default contactApi;
