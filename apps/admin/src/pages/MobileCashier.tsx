import { useState, useEffect } from 'react';
import { Bell, TrendingUp, Plus, Minus, ShoppingBag, Receipt, Home, Layers, LayoutGrid } from 'lucide-react';
import { fetchDashboardStats, fetchTransactions, DashboardStats, Transaction } from '../services/api';
import { useAuth } from '../context/AuthContext';

const MobileCashier = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [statsData, txData] = await Promise.all([
                    fetchDashboardStats('24h'),
                    fetchTransactions({ limit: 5 })
                ]);
                setStats(statsData);
                setTransactions(txData);
            } catch (error) {
                console.error('Failed to load mobile data', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount).replace('IDR', 'Rp');
    };

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };

    const getTransactionIcon = (type: string) => {
        return type === 'income' ? ShoppingBag : Receipt;
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24 md:hidden">
            {/* Header */}
            <div className="bg-cream p-6 pb-20 rounded-b-[2rem]">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full border-2 border-white bg-gold flex items-center justify-center text-white font-bold text-lg">
                            {user?.name?.charAt(0) || 'K'}
                        </div>
                        <div>
                            <h2 className="font-bold text-lg text-brown-dark flex items-center gap-1">
                                Halo, {user?.name || 'Kasir'} <span className="text-xl">👋</span>
                            </h2>
                            <p className="text-xs text-brown/60 font-medium">Siap mencatat?</p>
                        </div>
                    </div>
                    <button className="p-2 bg-white rounded-full text-brown-dark shadow-sm">
                        <Bell size={20} />
                    </button>
                </div>

                {/* Session Card */}
                <div className="bg-gradient-to-br from-gold to-orange-400 rounded-3xl p-6 text-white shadow-xl shadow-orange-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>

                    <p className="text-white/90 text-sm font-medium mb-1">Total Hari Ini</p>
                    {loading ? (
                        <div className="h-10 w-48 bg-white/20 rounded animate-pulse"></div>
                    ) : (
                        <h1 className="text-4xl font-extrabold mb-4">{formatCurrency(stats?.income || 0)}</h1>
                    )}

                    <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md">
                        <TrendingUp size={14} />
                        <span>{stats?.orderCount || 0} Transaksi</span>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="px-6 -mt-12 flex gap-4 mb-8">
                <button className="flex-1 bg-[#E8F5E9] p-6 rounded-3xl flex flex-col items-center gap-3 shadow-sm active:scale-95 transition-transform hover:bg-green-100">
                    <div className="w-12 h-12 bg-[#1B5E20] rounded-full flex items-center justify-center text-white shadow-lg shadow-green-900/20">
                        <Plus size={24} strokeWidth={3} />
                    </div>
                    <span className="font-bold text-[#1B5E20]">Masukan</span>
                </button>
                <button className="flex-1 bg-[#FFEBEE] p-6 rounded-3xl flex flex-col items-center gap-3 shadow-sm active:scale-95 transition-transform hover:bg-red-100">
                    <div className="w-12 h-12 bg-[#B71C1C] rounded-full flex items-center justify-center text-white shadow-lg shadow-red-900/20">
                        <Minus size={24} strokeWidth={3} />
                    </div>
                    <span className="font-bold text-[#B71C1C]">Pengeluaran</span>
                </button>
            </div>

            {/* Recent Transactions List */}
            <div className="px-6">
                <div className="flex justify-between items-end mb-4">
                    <h3 className="font-bold text-lg text-brown-dark">Terakhir</h3>
                    <button className="text-xs font-bold text-gold-dark hover:underline">Lihat Semua</button>
                </div>

                <div className="space-y-3">
                    {loading ? (
                        // Loading skeleton
                        [1, 2, 3].map((i) => (
                            <div key={i} className="bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm animate-pulse">
                                <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                                <div className="flex-1">
                                    <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-3 w-16 bg-gray-100 rounded"></div>
                                </div>
                                <div className="h-4 w-20 bg-gray-200 rounded"></div>
                            </div>
                        ))
                    ) : transactions.length === 0 ? (
                        <div className="bg-white p-6 rounded-2xl text-center text-gray-400">
                            <p>Belum ada transaksi hari ini</p>
                        </div>
                    ) : (
                        transactions.map((tx) => {
                            const Icon = getTransactionIcon(tx.type);
                            return (
                                <div key={tx.id} className="bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${tx.type === 'income' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        <Icon size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-brown-dark text-sm">{tx.description || (tx.type === 'income' ? 'Pemasukan' : 'Pengeluaran')}</h4>
                                        <p className="text-[10px] text-gray-400 font-medium">{formatTime(tx.createdAt)} • {tx.paymentMethod || 'Tunai'}</p>
                                    </div>
                                    <span className={`font-bold text-sm ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                        {tx.type === 'income' ? '+' : '-'} {formatCurrency(tx.amount)}
                                    </span>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-around items-center md:hidden">
                <button className="flex flex-col items-center gap-1 text-gold">
                    <Home size={22} />
                    <span className="text-[10px] font-bold">Home</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-gray-400">
                    <Receipt size={22} />
                    <span className="text-[10px] font-medium">Kas</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-gray-400">
                    <Layers size={22} />
                    <span className="text-[10px] font-medium">Stok</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-gray-400">
                    <LayoutGrid size={22} />
                    <span className="text-[10px] font-medium">Menu</span>
                </button>
            </div>
        </div>
    );
};

export default MobileCashier;
