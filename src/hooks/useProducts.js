import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import productApi from '../services/productApi';

// Query keys
export const productKeys = {
    all: ['products'],
    lists: () => [...productKeys.all, 'list'],
    list: (filters) => [...productKeys.lists(), filters],
    details: () => [...productKeys.all, 'detail'],
    detail: (slug) => [...productKeys.details(), slug],
};

/**
 * Hook to fetch products with optional filters
 */
export function useProducts(filters = {}) {
    return useQuery({
        queryKey: productKeys.list(filters),
        queryFn: () => productApi.getProducts(filters),
    });
}

/**
 * Hook to fetch a single product by slug
 */
export function useProduct(slug) {
    return useQuery({
        queryKey: productKeys.detail(slug),
        queryFn: () => productApi.getProduct(slug),
        enabled: !!slug,
    });
}

/**
 * Hook to create a product
 */
export function useCreateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: productApi.createProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });
        },
    });
}

/**
 * Hook to update a product
 */
export function useUpdateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => productApi.updateProduct(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: productKeys.all });
        },
    });
}

/**
 * Hook to delete a product
 */
export function useDeleteProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: productApi.deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });
        },
    });
}
