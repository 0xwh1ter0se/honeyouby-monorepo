import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { fetchTransactions, resetData } from '../services/api';
import DailyHoneyPot from '../components/DailyHoneyPot';
import QuickStats from '../components/QuickStats';
import TransactionHistoryTable from '../components/TransactionHistoryTable';

const Transactions = () => {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadTransactions = async () => {
            setLoading(true);
            try {
                const data = await fetchTransactions({ limit: 100 }); // Fetch more for export
                setTransactions(data);
            } catch (error) {
                console.error("Failed to load transactions", error);
            } finally {
                setLoading(false);
            }
        };
        loadTransactions();
    }, []);



    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">Admin Panel</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-brown-dark flex items-center gap-2">
                        Transaction History
                    </h1>
                    <p className="text-gray-400 font-medium mt-1">Manage your sweet sales and Ubi Cilembu orders.</p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={async () => {
                            if (confirm('ARE YOU SURE? This will delete ALL orders and transactions!')) {
                                try {
                                    const success = await resetData();
                                    if (success) {
                                        window.location.reload();
                                    } else {
                                        alert('Failed to reset');
                                    }
                                } catch (e) { alert('Failed to reset'); }
                            }
                        }}
                        className="flex items-center gap-2 px-3 py-3 bg-red-50 text-red-600 border border-red-100 rounded-xl font-bold hover:bg-red-100 transition-all text-xs"
                    >
                        <span>Reset Data</span>
                    </button>

                    <button className="flex items-center gap-2 px-6 py-3 bg-gold hover:bg-gold-dark text-white rounded-xl font-bold shadow-lg shadow-gold/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0">
                        <Plus size={18} />
                        <span>New Order</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content (Left) */}
                <div className="lg:col-span-2">
                    <TransactionHistoryTable transactions={transactions} loading={loading} />
                </div>

                {/* Sidebar (Right) */}
                <div className="space-y-6">
                    <DailyHoneyPot />

                    <QuickStats />

                    {/* Promo Card */}
                    <div className="bg-[#1a1a1a] rounded-[2rem] p-6 text-white relative overflow-hidden group cursor-pointer">
                        <div className="relative z-10">
                            <span className="bg-gold text-brown-dark text-[10px] font-bold px-2 py-1 rounded-md uppercase mb-2 inline-block">Seasonal</span>
                            <h3 className="text-xl font-bold mb-1">New Honey Batch! 🌸</h3>
                            <p className="text-gray-400 text-xs mb-4">Stock up on the new seasonal flavors.</p>
                        </div>
                        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-gold/20 rounded-full blur-xl group-hover:bg-gold/30 transition-colors"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Transactions;
