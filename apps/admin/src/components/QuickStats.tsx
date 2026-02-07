import { useState, useEffect } from 'react';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import { fetchDashboardStats } from '../services/api';

const QuickStats = () => {
    const [counts, setCounts] = useState({ completed: 128, pending: 15, cancelled: 7 }); // Mock default
    const [loading, setLoading] = useState(true);

    const loadStats = async () => {
        try {
            const data = await fetchDashboardStats('24h'); // Quick stats usually for "Today"
            if (data && data.orderCounts) {
                setCounts(data.orderCounts);
            }
        } catch (error) {
            console.error('Failed to load quick stats:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStats();
        const interval = setInterval(loadStats, 30000);
        return () => clearInterval(interval);
    }, []);

    const stats = [
        { label: 'Completed', count: counts.completed, sub: 'Orders today', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
        { label: 'Pending', count: counts.pending, sub: 'Needs action', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
        { label: 'Cancelled', count: counts.cancelled, sub: 'Issues', icon: XCircle, color: 'text-red-500', bg: 'bg-red-100' },
    ];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center gap-2 mb-6">
                <span className="text-gold-dark">⚡</span>
                <h3 className="font-bold text-lg text-brown-dark dark:text-white">Quick Stats</h3>
            </div>

            <div className="space-y-4">
                {stats.map((stat, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl hover:bg-cream dark:hover:bg-gray-700 transition-colors group cursor-default">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 ${stat.bg} ${stat.color} dark:bg-opacity-20 rounded-full flex items-center justify-center`}>
                                <stat.icon size={20} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h4 className="font-bold text-brown-dark dark:text-gray-200 text-sm">{stat.label}</h4>
                                <p className="text-xs text-gray-400 font-medium group-hover:text-gold-dark/70 dark:group-hover:text-gold">{stat.sub}</p>
                            </div>
                        </div>
                        <span className="text-xl font-extrabold text-brown-dark dark:text-white">{loading ? '...' : stat.count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuickStats;
