import { useState, useEffect } from 'react';
import { TrendingUp, ArrowRight, TrendingDown } from 'lucide-react';
import { fetchDashboardStats, type DashboardStats } from '../services/api';

const DailyHoneyPot = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [changePercent, setChangePercent] = useState<number>(0);

    // Format currency to Rupiah
    const formatRupiah = (value: number) => {
        if (value >= 1000000) {
            return `Rp ${(value / 1000000).toFixed(1)}M`;
        } else if (value >= 1000) {
            return `Rp ${(value / 1000).toFixed(1)}k`;
        }
        return `Rp ${value.toLocaleString('id-ID')}`;
    };

    // Fetch dashboard stats
    const loadStats = async () => {
        try {
            const data = await fetchDashboardStats('24h');
            setStats(data);

            // Calculate change vs yesterday (approximation using 7d data)
            const weekData = await fetchDashboardStats('7d');
            if (weekData && weekData.revenue > 0 && data.revenue > 0) {
                const avgDaily = weekData.revenue / 7;
                const change = ((data.revenue - avgDaily) / avgDaily) * 100;
                setChangePercent(Math.round(change));
            }
        } catch (error) {
            console.error('Failed to load daily stats:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStats();
        // Auto-refresh every 30 seconds
        const interval = setInterval(loadStats, 30000);
        return () => clearInterval(interval);
    }, []);

    const revenue = stats?.revenue || stats?.income || 0;
    const totalItems = stats?.totalItems || 0;
    const isPositive = changePercent >= 0;

    return (
        <div className="bg-gold rounded-[2rem] p-6 text-white relative overflow-hidden shadow-lg shadow-gold/40">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-brown-dark/10 rounded-full -ml-8 -mb-8 blur-xl"></div>

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <div>
                        <h3 className="font-bold text-lg leading-tight">Daily <br />Honeyouby</h3>
                    </div>
                </div>

                <div className="mb-6">
                    <p className="text-white/80 text-sm font-medium mb-1">Total Sweet Sales</p>
                    <h2 className="text-4xl font-extrabold mb-3">
                        {loading ? '...' : formatRupiah(revenue)}
                    </h2>
                    <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md">
                        {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        <span>{isPositive ? '+' : ''}{changePercent}% vs avg</span>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-white/70 text-xs font-bold uppercase tracking-wider mb-1">Volume</p>
                        <p className="text-xl font-bold">
                            {loading ? '...' : `${totalItems} Boxes`}
                        </p>
                    </div>
                    <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gold-dark hover:scale-110 transition-transform shadow-md">
                        <ArrowRight size={20} strokeWidth={3} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DailyHoneyPot;
