import apiClient from '../lib/apiClient';

/**
 * Blog API Service
 */
export const blogApi = {
    /**
     * Get all published blogs
     */
    getBlogs: async () => {
        return apiClient.get('/blogs');
    },

    /**
     * Get single blog by slug
     */
    getBlog: async (slug) => {
        return apiClient.get(`/blogs/${slug}`);
    },

    /**
     * Get all blogs including drafts (admin only)
     */
    getAllBlogs: async () => {
        return apiClient.get('/blogs/admin/all');
    },

    /**
     * Create blog (admin only)
     */
    createBlog: async (data) => {
        return apiClient.post('/blogs', data);
    },

    /**
     * Update blog (admin only)
     */
    updateBlog: async (id, data) => {
        return apiClient.patch(`/blogs/${id}`, data);
    },

    /**
     * Delete blog (admin only)
     */
    deleteBlog: async (id) => {
        return apiClient.delete(`/blogs/${id}`);
    },
};

export default blogApi;
