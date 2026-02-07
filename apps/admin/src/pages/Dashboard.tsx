import { useState, useEffect, useCallback } from 'react';
import { DollarSign, ShoppingBag, Receipt, TrendingUp, RefreshCw, Star } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import RevenueChart from '../components/RevenueChart';
import TopSelling from '../components/TopSelling';
import RecentTransactions from '../components/RecentTransactions';
import MobileCashier from './MobileCashier';
import { fetchDashboardStats } from '../services/api';
import type { DashboardStats } from '../services/api';

const Dashboard = () => {
    const [timeFilter, setTimeFilter] = useState<'24h' | '7d' | '30d'>('30d');
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    // Format currency
    const formatRupiah = (value: number) => {
        if (value >= 1000000) {
            return `Rp ${(value / 1000000).toFixed(1)}M`;
        } else if (value >= 1000) {
            return `Rp ${(value / 1000).toFixed(1)}k`;
        }
        return `Rp ${value.toLocaleString('id-ID')}`;
    };

    // Fetch stats from API
    const loadStats = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchDashboardStats(timeFilter);
            setStats(data);
            setLastUpdated(new Date());
        } catch (error) {
            console.error('Failed to load stats:', error);
        } finally {
            setLoading(false);
        }
    }, [timeFilter]);

    // Initial load and when filter changes
    useEffect(() => {
        loadStats();
    }, [loadStats]);

    // Auto-refresh every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            loadStats();
        }, 30000);
        return () => clearInterval(interval);
    }, [loadStats]);

    // Get display values
    const getDisplayStats = () => {
        if (!stats) {
            return {
                revenue: { value: 'Loading...', change: '...' },
                orders: { value: '...', change: '...' },
                avgOrder: { value: '...', change: '...' },
                netProfit: { value: '...', change: '...' }
            };
        }

        return {
            revenue: { value: formatRupiah(stats.revenue || stats.income), change: '+8%' },
            orders: { value: stats.orderCount.toLocaleString('id-ID'), change: '+5%' },
            avgOrder: { value: formatRupiah(stats.avgOrderValue), change: '+2%' },
            netProfit: { value: formatRupiah(stats.netProfit), change: '+12.5%' }
        };
    };

    const displayStats = getDisplayStats();

    return (
        <>
            {/* Mobile View */}
            <MobileCashier />

            {/* Desktop View */}
            <div className="space-y-8 animate-fade-in hidden md:block">
                {/* Header & Filters */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-brown-dark dark:text-white">Dashboard Overview</h1>
                        <p className="text-gray-400 font-medium text-sm flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Live Updates
                            <span className="ml-2 text-xs text-gray-300 dark:text-gray-600 border-l pl-2 border-gray-300 dark:border-gray-600">
                                Last updated: {lastUpdated.toLocaleTimeString('id-ID')}
                            </span>
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={loadStats}
                            disabled={loading}
                            className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all disabled:opacity-50"
                            title="Refresh data"
                        >
                            <RefreshCw size={18} className={`text-gray-500 dark:text-gray-400 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                        <div className="flex bg-white dark:bg-gray-800 rounded-xl p-1 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                            <button
                                onClick={() => setTimeFilter('24h')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${timeFilter === '24h' ? 'bg-gold text-white shadow-md' : 'text-gray-400 hover:text-gold-dark dark:hover:text-gold'}`}
                            >
                                24 Hours
                            </button>
                            <button
                                onClick={() => setTimeFilter('7d')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${timeFilter === '7d' ? 'bg-gold text-white shadow-md' : 'text-gray-400 hover:text-gold-dark dark:hover:text-gold'}`}
                            >
                                7 Days
                            </button>
                            <button
                                onClick={() => setTimeFilter('30d')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${timeFilter === '30d' ? 'bg-gold text-white shadow-md' : 'text-gray-400 hover:text-gold-dark dark:hover:text-gold'}`}
                            >
                                30 Days
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard
                        title="Total Revenue"
                        value={displayStats.revenue.value}
                        change={displayStats.revenue.change}
                        isPositive={true}
                        icon={DollarSign}
                        color="gold"
                    />
                    <StatsCard
                        title="Total Orders"
                        value={displayStats.orders.value}
                        change={displayStats.orders.change}
                        isPositive={true}
                        icon={ShoppingBag}
                        color="brown"
                    />
                    <StatsCard
                        title="Avg. Order Value"
                        value={displayStats.avgOrder.value}
                        change={displayStats.avgOrder.change}
                        isPositive={true}
                        icon={Receipt}
                        color="yellow"
                    />
                    <StatsCard
                        title="Net Profit"
                        value={displayStats.netProfit.value}
                        change={displayStats.netProfit.change}
                        isPositive={true}
                        icon={TrendingUp}
                        color="green"
                    />
                    <StatsCard
                        title="Customer Rating"
                        value={stats?.avgRating ? `${Number(stats.avgRating).toFixed(1)} / 5.0` : 'N/A'}
                        change={stats?.reviewCount ? `${stats.reviewCount} Reviews` : 'No reviews'}
                        isPositive={true}
                        icon={Star}
                        color="gold"
                    />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 h-[380px]">
                        <RevenueChart />
                    </div>
                    <div className="h-[380px]">
                        <TopSelling />
                    </div>
                </div>

                {/* Recent Transactions */}
                <div>
                    <RecentTransactions />
                </div>
            </div>
        </>
    );
};

export default Dashboard;
