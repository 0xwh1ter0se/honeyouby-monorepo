import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import categoryApi from '../services/categoryApi';

export const categoryKeys = {
    all: ['categories'],
    list: () => [...categoryKeys.all, 'list'],
};

/**
 * Hook to fetch all categories
 */
export function useCategories() {
    return useQuery({
        queryKey: categoryKeys.list(),
        queryFn: categoryApi.getCategories,
    });
}

/**
 * Hook to create a category
 */
export function useCreateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: categoryApi.createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: categoryKeys.all });
        },
    });
}

/**
 * Hook to update a category
 */
export function useUpdateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => categoryApi.updateCategory(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: categoryKeys.all });
        },
    });
}

/**
 * Hook to delete a category
 */
export function useDeleteCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: categoryApi.deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: categoryKeys.all });
        },
    });
}
