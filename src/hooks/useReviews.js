import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import reviewApi from '../services/reviewApi';

export const reviewKeys = {
    all: ['reviews'],
    product: (productId) => [...reviewKeys.all, 'product', productId],
    pending: () => [...reviewKeys.all, 'pending'],
};

/**
 * Hook to fetch reviews for a product
 */
export function useProductReviews(productId) {
    return useQuery({
        queryKey: reviewKeys.product(productId),
        queryFn: () => reviewApi.getProductReviews(productId),
        enabled: !!productId,
    });
}

/**
 * Hook to fetch pending reviews (admin)
 */
export function usePendingReviews() {
    return useQuery({
        queryKey: reviewKeys.pending(),
        queryFn: reviewApi.getPendingReviews,
    });
}

/**
 * Hook to create a review
 */
export function useCreateReview() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ productId, data }) => reviewApi.createReview(productId, data),
        onSuccess: (_, { productId }) => {
            queryClient.invalidateQueries({ queryKey: reviewKeys.product(productId) });
        },
    });
}

/**
 * Hook to approve a review (admin)
 */
export function useApproveReview() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: reviewApi.approveReview,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: reviewKeys.all });
        },
    });
}

/**
 * Hook to delete a review (admin)
 */
export function useDeleteReview() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: reviewApi.deleteReview,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: reviewKeys.all });
        },
    });
}
