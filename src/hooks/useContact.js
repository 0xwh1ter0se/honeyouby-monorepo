import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import contactApi from '../services/contactApi';

export const contactKeys = {
    all: ['contacts'],
    messages: () => [...contactKeys.all, 'messages'],
};

/**
 * Hook to fetch contact messages (admin)
 */
export function useContactMessages() {
    return useQuery({
        queryKey: contactKeys.messages(),
        queryFn: contactApi.getMessages,
    });
}

/**
 * Hook to send a contact message
 */
export function useSendContactMessage() {
    return useMutation({
        mutationFn: contactApi.sendMessage,
    });
}

/**
 * Hook to mark message as read (admin)
 */
export function useMarkMessageRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: contactApi.markAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: contactKeys.all });
        },
    });
}

/**
 * Hook to delete a message (admin)
 */
export function useDeleteMessage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: contactApi.deleteMessage,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: contactKeys.all });
        },
    });
}
