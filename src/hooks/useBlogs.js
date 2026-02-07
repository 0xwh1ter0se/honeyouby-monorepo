import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import blogApi from '../services/blogApi';

export const blogKeys = {
    all: ['blogs'],
    lists: () => [...blogKeys.all, 'list'],
    adminLists: () => [...blogKeys.all, 'admin'],
    details: () => [...blogKeys.all, 'detail'],
    detail: (slug) => [...blogKeys.details(), slug],
};

/**
 * Hook to fetch published blogs
 */
export function useBlogs() {
    return useQuery({
        queryKey: blogKeys.lists(),
        queryFn: blogApi.getBlogs,
    });
}

/**
 * Hook to fetch a single blog by slug
 */
export function useBlog(slug) {
    return useQuery({
        queryKey: blogKeys.detail(slug),
        queryFn: () => blogApi.getBlog(slug),
        enabled: !!slug,
    });
}

/**
 * Hook to fetch all blogs including drafts (admin)
 */
export function useAllBlogs() {
    return useQuery({
        queryKey: blogKeys.adminLists(),
        queryFn: blogApi.getAllBlogs,
    });
}

/**
 * Hook to create a blog
 */
export function useCreateBlog() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: blogApi.createBlog,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: blogKeys.all });
        },
    });
}

/**
 * Hook to update a blog
 */
export function useUpdateBlog() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => blogApi.updateBlog(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: blogKeys.all });
        },
    });
}

/**
 * Hook to delete a blog
 */
export function useDeleteBlog() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: blogApi.deleteBlog,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: blogKeys.all });
        },
    });
}
