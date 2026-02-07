import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import orderApi from '../services/orderApi';

export const orderKeys = {
    all: ['orders'],
    lists: () => [...orderKeys.all, 'list'],
    myOrders: () => [...orderKeys.all, 'my'],
    adminOrders: () => [...orderKeys.all, 'admin'],
    details: () => [...orderKeys.all, 'detail'],
    detail: (id) => [...orderKeys.details(), id],
};

/**
 * Hook to fetch current user's orders
 */
export function useMyOrders() {
    return useQuery({
        queryKey: orderKeys.myOrders(),
        queryFn: orderApi.getMyOrders,
    });
}

/**
 * Hook to fetch a single order
 */
export function useOrder(id) {
    return useQuery({
        queryKey: orderKeys.detail(id),
        queryFn: () => orderApi.getOrder(id),
        enabled: !!id,
    });
}

/**
 * Hook to fetch all orders (admin)
 */
export function useAllOrders() {
    return useQuery({
        queryKey: orderKeys.adminOrders(),
        queryFn: orderApi.getAllOrders,
    });
}

/**
 * Hook to create an order (checkout)
 */
export function useCreateOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: orderApi.createOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: orderKeys.all });
        },
    });
}

/**
 * Hook to update order status (admin)
 */
export function useUpdateOrderStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }) => orderApi.updateOrderStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: orderKeys.all });
        },
    });
}
