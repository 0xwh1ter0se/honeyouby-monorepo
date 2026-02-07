import { useState } from 'react';
import { Search, RefreshCw } from 'lucide-react';
import type { Transaction } from '../services/api';

const TransactionHistoryTable = ({ transactions, loading }: { transactions: Transaction[], loading: boolean }) => {
    // Internal state only for filters
    const [statusFilter, setStatusFilter] = useState('All');
    const [paymentFilter, setPaymentFilter] = useState('All');
    const [sourceFilter, setSourceFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    // Removed internal fetching logic as it is now lifted to parent

    // Transform API data to display format
    const displayData = transactions.map(tx => {
        let productName = tx.description?.split(':')[1]?.trim() || 'N/A';
        // Simplify product name: Remove "Cilembu" and common suffixes
        productName = productName
            .replace(/Cilembu /gi, '')
            .replace(/ Dream/gi, '')
            .replace(/ Honey/gi, '')
            .replace(/ Bliss/gi, '')
            .replace(/ Delight/gi, '')
            .replace(/ Sweet/gi, '') // Berry Sweet
            .replace(/ Lava/gi, ' Lava') // Keep Lava? User said Choco matcha tiramissu. "Choco Lava" -> "Choco"?
            // actually user said "Choco matcha tiramissu".
            // "Cilembu Choco Lava" -> "Choco". 
            // "Cilembu Matcha Bliss" -> "Matcha".
            // "Cilembu Tiramissu Delight" -> "Tiramissu".
            // "Cilembu Taro Dream" -> "Taro".
            // "Cilembu Berry Sweet" -> "Strawberry" (or Berry).
            // "Cilembu Original Honey" -> "Original".
            .replace(/Lava/gi, '') // Remove Lava to just get Choco? 
            // Wait, "Choco Lava" is the flavor. "Choco" might be enough.
            // Let's try to be smart.
            .trim();

        // Manual map for cleanliness if regex fails or to be precise
        if (productName.includes('Taro')) productName = 'Taro';
        else if (productName.includes('Matcha')) productName = 'Matcha';
        else if (productName.includes('Tiramissu')) productName = 'Tiramissu';
        else if (productName.includes('Choco')) productName = 'Choco';
        else if (productName.includes('Berry') || productName.includes('Strawberry')) productName = 'Strawberry';
        else if (productName.includes('Original')) productName = 'Original';

        return {
            id: `${tx.id}#HO!`,
            customer: tx.description?.split(':')[0].replace('Order #', 'Order ') || 'Customer',
            product: productName,
            amount: `Rp ${tx.amount.toLocaleString('id-ID')}`,
            status: 'Success', // Transactions are successful money moves. Orders are where status lives.
            paymentMethod: tx.paymentMethod?.toUpperCase() || 'CASH',
            source: tx.source || 'store',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(tx.description?.substring(0, 2) || 'HO')}&background=random`
        };
    });

    const filteredTransactions = displayData.filter(tx => {
        const matchesStatus = statusFilter === 'All' || tx.status === statusFilter;
        const matchesPayment = paymentFilter === 'All' ||
            (paymentFilter === 'Pay' && tx.paymentMethod === 'CASH') || // User said PAY? No, User said Header Payment -> PAY. Filter "Payment" -> maybe keep keys?
            (paymentFilter === 'Cash' && tx.paymentMethod === 'CASH') ||
            (paymentFilter === 'Cashless' && tx.paymentMethod !== 'CASH');
        const matchesSource = sourceFilter === 'All' ||
            (sourceFilter === 'Store' && tx.source === 'store') ||
            (sourceFilter === 'Online' && tx.source !== 'store');

        const matchesSearch = tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tx.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tx.product.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesStatus && matchesPayment && matchesSource && matchesSearch;
    });

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'Success': return 'bg-green-100 text-green-700';
            case 'Pending': return 'bg-orange-100 text-orange-700';
            case 'Cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getSourceLabel = (source: string) => {
        const labels: Record<string, string> = {
            store: 'STR',
            gofood: 'GJK',
            grabfood: 'GRB',
            shopeefood: 'SPX',
            website: 'WEB',
            other: 'OTH'
        };
        return labels[source] || source.toUpperCase().substring(0, 3);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-8 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            {/* Main Source Tabs */}
            <div className="flex bg-gray-50 dark:bg-gray-700 p-1 rounded-2xl mb-8 mx-auto md:w-fit md:mx-0 transition-colors">
                {['All', 'Store', 'Online'].map(src => (
                    <button
                        key={src}
                        onClick={() => setSourceFilter(src)}
                        className={`flex-1 md:flex-none px-8 py-3 rounded-xl text-sm font-bold transition-all ${sourceFilter === src
                            ? 'bg-white dark:bg-gray-600 text-brown-dark dark:text-white shadow-md'
                            : 'text-gray-400 hover:text-gold-dark dark:hover:text-gold'
                            }`}
                    >
                        {src === 'All' ? 'All Transactions' : src === 'Store' ? 'In-Store' : 'Online / Partners'}
                    </button>
                ))}
            </div>

            {/* Header Controls */}
            <div className="flex flex-col md:flex-row gap-4 justify-between mb-8">
                <div className="flex-1 bg-gray-50 dark:bg-gray-700 rounded-xl flex items-center px-4 py-3 border border-transparent focus-within:bg-white dark:focus-within:bg-gray-600 focus-within:border-gold/30 focus-within:ring-4 focus-within:ring-gold/10 transition-all">
                    <Search className="text-gray-400 mr-3" size={20} />
                    <input
                        type="text"
                        placeholder="Search by order ID or product..."
                        className="bg-transparent outline-none w-full text-sm font-medium text-brown-dark dark:text-gray-200 placeholder:text-gray-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 opacity-50 cursor-not-allowed transition-colors"
                >
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    <span>Live</span>
                </button>
            </div>

            {/* Filters Area */}
            <div className="space-y-4 mb-8">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    {/* Status Tabs */}
                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        {['All', 'Success', 'Pending', 'Cancelled'].map(status => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${statusFilter === status
                                    ? 'bg-brown-dark text-white'
                                    : 'bg-gray-50 dark:bg-gray-700 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    {/* Secondary Filter: Payment */}
                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 rounded-lg p-1 transition-colors">
                        <span className="text-xs font-bold text-gray-400 px-2 uppercase">Payment:</span>
                        {['All', 'Cash', 'Cashless'].map(type => (
                            <button
                                key={type}
                                onClick={() => setPaymentFilter(type)}
                                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${paymentFilter === type ? 'bg-white dark:bg-gray-600 shadow text-gold-dark dark:text-white' : 'text-gray-400'
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700">
                            <th className="pb-4 pl-8">Order ID</th>
                            <th className="pb-4 pl-4">Description</th>
                            <th className="pb-4 pl-4">Product</th>
                            <th className="pb-4 text-center">SRC</th>
                            <th className="pb-4 text-center">PAY</th>
                            <th className="pb-4 text-right pr-8">Amount</th>
                            <th className="pb-4 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                        {loading && transactions.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="py-8 text-center text-gray-400 font-medium">
                                    Loading transactions...
                                </td>
                            </tr>
                        ) : filteredTransactions.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="py-8 text-center text-gray-400 font-medium">
                                    No transactions found matching your filters.
                                </td>
                            </tr>
                        ) : (
                            filteredTransactions.map((tx) => (
                                <tr key={tx.id} className="group hover:bg-cream/30 dark:hover:bg-gray-700/30 transition-colors">
                                    <td className="py-4 pl-4 text-sm font-bold text-gold-dark">{tx.id}</td>
                                    <td className="py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={tx.avatar} alt="" className="w-10 h-10 rounded-full object-cover shadow-sm group-hover:scale-110 transition-transform" />
                                            <span className="text-sm font-bold text-brown-dark dark:text-gray-200">{tx.customer}</span>
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 max-w-[150px] truncate">{tx.product}</p>
                                    </td>
                                    <td className="py-4 text-center">
                                        <span className="text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/40 px-2 py-1 rounded">{getSourceLabel(tx.source)}</span>
                                    </td>
                                    <td className="py-4 text-center">
                                        <span className="text-xs font-bold text-brown-dark dark:text-gray-300">{tx.paymentMethod}</span>
                                    </td>
                                    <td className="py-4 text-right text-sm font-bold text-green-600 dark:text-green-400">{tx.amount}</td>
                                    <td className="py-4 text-center">
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold inline-block w-24 ${getStatusStyles(tx.status)}`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-6 flex justify-between items-center">
                <p className="text-sm text-gray-400">
                    Showing <span className="font-bold text-brown-dark dark:text-white">{filteredTransactions.length}</span> transactions
                </p>
                <div className="flex gap-2">
                    {[1, 2, 3].map(p => (
                        <button key={p} className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${p === 1 ? 'bg-gold text-white shadow-md' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                            {p}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TransactionHistoryTable;
