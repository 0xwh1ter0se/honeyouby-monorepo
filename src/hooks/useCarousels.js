import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import carouselApi from '../services/carouselApi';

export const carouselKeys = {
    all: ['carousels'],
    active: () => [...carouselKeys.all, 'active'],
    admin: () => [...carouselKeys.all, 'admin'],
};

/**
 * Hook to fetch active carousels
 */
export function useCarousels() {
    return useQuery({
        queryKey: carouselKeys.active(),
        queryFn: carouselApi.getCarousels,
    });
}

/**
 * Hook to fetch all carousels (admin)
 */
export function useAllCarousels() {
    return useQuery({
        queryKey: carouselKeys.admin(),
        queryFn: carouselApi.getAllCarousels,
    });
}

/**
 * Hook to create a carousel
 */
export function useCreateCarousel() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: carouselApi.createCarousel,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: carouselKeys.all });
        },
    });
}

/**
 * Hook to update a carousel
 */
export function useUpdateCarousel() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => carouselApi.updateCarousel(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: carouselKeys.all });
        },
    });
}

/**
 * Hook to delete a carousel
 */
export function useDeleteCarousel() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: carouselApi.deleteCarousel,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: carouselKeys.all });
        },
    });
}
