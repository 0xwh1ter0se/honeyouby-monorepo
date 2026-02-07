import { useState, useEffect } from 'react';
import { Filter, MoreHorizontal, RefreshCw } from 'lucide-react';
import { fetchTransactions } from '../services/api';
import type { Transaction } from '../services/api';

const RecentTransactions = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    const loadTransactions = async () => {
        setLoading(true);
        try {
            const data = await fetchTransactions({ limit: 10 });
            setTransactions(data);
        } catch (error) {
            console.error('Failed to load transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTransactions();
        // Auto-refresh every 30 seconds
        const interval = setInterval(loadTransactions, 30000);
        return () => clearInterval(interval);
    }, []);

    const getStatusStyle = (type: string) => {
        switch (type) {
            case 'income': return 'bg-green-100 text-green-700';
            case 'expense': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getSourceStyle = (source: string | null) => {
        switch (source) {
            case 'store': return 'bg-blue-100 text-blue-700';
            case 'gofood': return 'bg-green-100 text-green-700';
            case 'grabfood': return 'bg-green-100 text-green-700';
            case 'shopeefood': return 'bg-orange-100 text-orange-700';
            case 'website': return 'bg-purple-100 text-purple-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const formatRupiah = (amount: number) => {
        return `Rp ${amount.toLocaleString('id-ID')}`;
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <h3 className="font-bold text-lg text-brown-dark dark:text-white">Recent Transactions</h3>
                    {loading && <RefreshCw size={16} className="animate-spin text-gray-400" />}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={loadTransactions}
                        className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        <RefreshCw size={16} /> Refresh
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <Filter size={16} /> Filter
                    </button>

                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider border-b border-gray-50 dark:border-gray-700">
                            <th className="pb-4 pl-4">ID</th>
                            <th className="pb-4">Description</th>
                            <th className="pb-4">Date</th>
                            <th className="pb-4">Source</th>
                            <th className="pb-4">Amount</th>
                            <th className="pb-4">Type</th>
                            <th className="pb-4 pr-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                        {transactions.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="py-8 text-center text-gray-400">
                                    {loading ? 'Loading transactions...' : 'No transactions yet'}
                                </td>
                            </tr>
                        ) : (
                            transactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="py-4 pl-4 text-sm font-bold text-brown-dark dark:text-gray-200">#{tx.id}#HO!</td>
                                    <td className="py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${tx.type === 'income' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                                                }`}>
                                                {tx.type === 'income' ? '+' : '-'}
                                            </div>
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 max-w-xs truncate">
                                                {tx.description || 'No description'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 text-sm text-gray-500 dark:text-gray-400">{formatDate(tx.createdAt)}</td>
                                    <td className="py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${getSourceStyle(tx.source)}`}>
                                            {tx.source?.toUpperCase() || 'N/A'}
                                        </span>
                                    </td>
                                    <td className={`py-4 text-sm font-bold ${tx.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                        {tx.type === 'income' ? '+' : '-'}{formatRupiah(tx.amount)}
                                    </td>
                                    <td className="py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(tx.type)}`}>
                                            {tx.type === 'income' ? 'Income' : 'Expense'}
                                        </span>
                                    </td>
                                    <td className="py-4 pr-4 text-right">
                                        <button className="p-1 text-gray-400 hover:text-brown-dark dark:hover:text-white transition-colors">
                                            <MoreHorizontal size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentTransactions;
