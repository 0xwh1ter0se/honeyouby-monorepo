// src/services/api.ts
// Integration layer between HO! Finance Dashboard and HoneyOuby Backend API

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

// Types
export interface DashboardStats {
    revenue: number;
    income: number;
    expense: number;
    netProfit: number;
    orderCount: number;
    totalItems?: number;
    avgOrderValue: number;
    period: string;
    orderCounts?: {
        completed: number;
        pending: number;
        cancelled: number;
    };
    chartData?: Array<{ name: string; revenue: number; expense: number }>;
    pieData?: Array<{ name: string; value: number }>;
    avgRating?: number;
    reviewCount?: number;
}

export interface Transaction {
    id: number;
    type: 'income' | 'expense';
    amount: number;
    description: string | null;
    paymentMethod: string | null;
    source: string | null;
    orderId: number | null;
    createdAt: string;
}

export interface DailyReport {
    id: number;
    date: string;
    totalIncome: number;
    totalExpense: number;
    netProfit: number;
    orderCount: number;
    notes: string | null;
    closedBy: string | null;
    closedAt: string | null;
}

export interface InventoryStats {
    totalProducts: number;
    lowStock: number;
    outOfStock: number;
    totalValue: number;
    products: Array<{
        id: number;
        name: string;
        stock: number | null;
        price: number;
        isActive: boolean | null;
    }>;
}

// Dashboard Stats
export const fetchDashboardStats = async (period: '24h' | '7d' | '30d' = '30d'): Promise<DashboardStats> => {
    try {
        const res = await fetch(`${API_BASE}/finance/stats?period=${period}`);
        if (!res.ok) throw new Error('Failed to fetch stats');
        return await res.json();
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        // Return mock data as fallback
        return {
            revenue: 0,
            income: 0,
            expense: 0,
            netProfit: 0,
            orderCount: 0,
            avgOrderValue: 0,
            period,
            pieData: [
                { name: 'Raw Materials', value: 33 },
                { name: 'Packaging', value: 25 },
                { name: 'Marketing', value: 25 },
                { name: 'Operational', value: 17 },
            ]
        };
    }
};

// Transactions
export const fetchTransactions = async (options?: {
    type?: 'income' | 'expense';
    source?: string;
    limit?: number;
    offset?: number;
}): Promise<Transaction[]> => {
    try {
        const params = new URLSearchParams();
        if (options?.type) params.append('type', options.type);
        if (options?.source) params.append('source', options.source);
        if (options?.limit) params.append('limit', options.limit.toString());
        if (options?.offset) params.append('offset', options.offset.toString());

        const res = await fetch(`${API_BASE}/finance/transactions?${params}`);
        if (!res.ok) throw new Error('Failed to fetch transactions');
        return await res.json();
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return [];
    }
};

export const createTransaction = async (data: {
    type: 'income' | 'expense';
    amount: number;
    description?: string;
    paymentMethod?: string;
    source?: string;
    orderId?: number;
    expenseCategoryId?: number;
}): Promise<Transaction | null> => {
    try {
        const res = await fetch(`${API_BASE}/finance/transactions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to create transaction');
        return await res.json();
    } catch (error) {
        console.error('Error creating transaction:', error);
        return null;
    }
};

// Daily Reports
export const fetchDailyReports = async (limit: number = 30): Promise<DailyReport[]> => {
    try {
        const res = await fetch(`${API_BASE}/finance/daily-reports?limit=${limit}`);
        if (!res.ok) throw new Error('Failed to fetch daily reports');
        return await res.json();
    } catch (error) {
        console.error('Error fetching daily reports:', error);
        return [];
    }
};

export const closeDailyReport = async (date?: Date, notes?: string): Promise<DailyReport | null> => {
    try {
        const res = await fetch(`${API_BASE}/finance/daily-reports/close`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date: date?.toISOString(), notes }),
        });
        if (!res.ok) throw new Error('Failed to close daily report');
        return await res.json();
    } catch (error) {
        console.error('Error closing daily report:', error);
        return null;
    }
};

// Inventory
export const fetchInventoryStats = async (): Promise<InventoryStats | null> => {
    try {
        const res = await fetch(`${API_BASE}/finance/inventory`);
        if (!res.ok) throw new Error('Failed to fetch inventory');
        return await res.json();
    } catch (error) {
        console.error('Error fetching inventory:', error);
        return null;
    }
};

// Orders
export interface Order {
    id: number;
    userId: string | null;
    paymentMethod: string;
    total: number;
    subtotal: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'paid';
    shippingAddress: string | null;
    notes: string | null;
    createdAt: string;
    guestName?: string;
    guestEmail?: string;
    guestPhone?: string;
}

export const fetchOrders = async (status?: string): Promise<Order[]> => {
    try {
        const url = status
            ? `${API_BASE}/orders/admin/all?status=${status}`
            : `${API_BASE}/orders/admin/all`;

        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch orders');
        return await res.json();
    } catch (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
};

export const updateOrderStatus = async (id: number, status: string): Promise<Order | null> => {
    try {
        const res = await fetch(`${API_BASE}/orders/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        if (!res.ok) throw new Error('Failed to update order status');
        return await res.json();
    } catch (error) {
        console.error('Error updating order:', error);
        return null;
    }
};

export const createOrder = async (data: any): Promise<Order | null> => {
    try {
        const res = await fetch(`${API_BASE}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to create order');
        return await res.json();
    } catch (error) {
        console.error('Error creating order:', error);
        return null;
    }
};

// Legacy compatibility - fetch recent transactions (for older components)
export const fetchRecentTransactions = async () => {
    const transactions = await fetchTransactions({ limit: 10 });
    return transactions.map(tx => ({
        id: `#${tx.id}#HO!`,
        customer: tx.description || 'Customer',
        date: new Date(tx.createdAt).toLocaleDateString(),
        amount: tx.amount,
        status: 'Completed',
    }));
};

// Product Management
export const createProduct = async (data: any) => {
    try {
        const res = await fetch(`${API_BASE}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({ error: 'Failed to create product' }));
            throw new Error(err.error || 'Failed to create product');
        }
        return await res.json();
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
};

export const updateProduct = async (id: number, data: any) => {
    try {
        const res = await fetch(`${API_BASE}/products/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({ error: 'Failed to update product' }));
            throw new Error(err.error || 'Failed to update product');
        }
        return await res.json();
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
};

export const deleteProduct = async (id: number) => {
    try {
        const res = await fetch(`${API_BASE}/products/${id}`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error('Failed to delete product');
        return true;
    } catch (error) {
        console.error('Error deleting product:', error);
        return false;
    }
};

// Helper for authenticated requests
const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
    const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        // vital for better-auth session cookies
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });
    return res;
};

// ... (Fetching Stats, Transactions, etc - update to use fetchWithAuth where appropriate, or globally apply credentials)
// For minimize diff, I will define a global fetch wrapper or just update key methods.
// Let's update the key methods used in Settings and Login first.

// Profile Management
export const getProfile = async () => {
    const res = await fetchWithAuth(`/user/profile`);
    if (!res.ok) throw new Error('Failed to fetch profile');
    return await res.json();
};

export const updateProfile = async (data: any) => {
    const res = await fetchWithAuth(`/user/profile`, {
        method: 'PATCH',
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return await res.json();
};

// Auth
export const loginUser = async (email: string, password: string) => {
    const res = await fetchWithAuth(`/auth/sign-in/email`, {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Login failed');
    }

    return await res.json();
};

export const changePassword = async (currentPassword: string, newPassword: string) => {
    const res = await fetchWithAuth(`/auth/change-password`, {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword, revokeOtherSessions: true })
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to change password');
    }

    return await res.json();
};

export const logoutUser = async () => {
    await fetchWithAuth(`/auth/sign-out`, {
        method: 'POST'
    });
};

// Blogs
export const fetchBlogs = async (params?: any) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetchWithAuth(`/blogs/admin/all?${query}`);
    if (!res.ok) throw new Error('Failed to fetch blogs');
    return await res.json();
};

export const createBlog = async (data: any) => {
    const res = await fetchWithAuth(`/blogs`, {
        method: 'POST',
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create blog');
    return await res.json();
};

export const updateBlog = async (id: number, data: any) => {
    const res = await fetchWithAuth(`/blogs/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update blog');
    return await res.json();
};

export const deleteBlog = async (id: number) => {
    const res = await fetchWithAuth(`/blogs/${id}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete blog');
    return true;
};
