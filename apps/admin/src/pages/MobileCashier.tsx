import { Bell, TrendingUp, Plus, Minus, ShoppingBag, Receipt, Coffee } from 'lucide-react';

const MobileCashier = () => {
    // This component is designed to be shown only on mobile screens via routing or css media queries

    const recentTransactions = [
        { title: 'Penjualan Madu Asli', time: '10:45 AM • Tunai', amount: '+ Rp 150.000', type: 'in', icon: ShoppingBag },
        { title: 'Beli Plastik Packing', time: '09:30 AM • Transfer', amount: '- Rp 25.000', type: 'out', icon: Receipt },
        { title: 'Penjualan Royal Jelly', time: '09:15 AM • QRIS', amount: '+ Rp 300.000', type: 'in', icon: Coffee },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-24 md:hidden">
            {/* Header */}
            <div className="bg-cream p-6 pb-20 rounded-b-[2rem]">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                        <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100" alt="Cashier" className="w-12 h-12 rounded-full border-2 border-white" />
                        <div>
                            <h2 className="font-bold text-lg text-brown-dark flex items-center gap-1">
                                Halo, Kasir 1 <span className="text-xl">👋</span>
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

                    <p className="text-white/90 text-sm font-medium mb-1">Total Sesi Ini</p>
                    <h1 className="text-4xl font-extrabold mb-4">Rp 1.250.000</h1>

                    <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md">
                        <TrendingUp size={14} />
                        <span>+12% dari kemarin</span>
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
                    {recentTransactions.map((tx, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${tx.type === 'in' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                                }`}>
                                <tx.icon size={20} />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-brown-dark text-sm">{tx.title}</h4>
                                <p className="text-[10px] text-gray-400 font-medium">{tx.time}</p>
                            </div>
                            <span className={`font-bold text-sm ${tx.type === 'in' ? 'text-green-600' : 'text-red-600'}`}>
                                {tx.amount}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MobileCashier;
