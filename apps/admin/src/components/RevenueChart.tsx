import { useState, useEffect } from 'react';
import { fetchDashboardStats, type DashboardStats } from '../services/api';

const RevenueChart = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState<'24h' | '7d' | '30d'>('30d');

    useEffect(() => {
        const loadStats = async () => {
            setLoading(true);
            try {
                const data = await fetchDashboardStats(period);
                if (data) {
                    setStats(data);
                }
            } catch (error) {
                console.error('Failed to load stats:', error);
            } finally {
                setLoading(false);
            }
        };

        loadStats();
        const interval = setInterval(loadStats, 30000);
        return () => clearInterval(interval);
    }, [period]);

    const formatValue = (val: number) => {
        if (val >= 1000000) {
            return `Rp ${val.toLocaleString('id-ID')}`;
        } else if (val >= 1000) {
            return `Rp ${(val / 1000).toFixed(0)}k`;
        }
        return `Rp ${val.toLocaleString('id-ID')}`;
    };

    const revenue = stats?.revenue || stats?.income || 0;
    const changePercent = 12.5;

    // Generate trend data for the line chart
    const generateTrendData = () => {
        const points = [];
        const numPoints = period === '24h' ? 24 : period === '7d' ? 7 : 4;
        for (let i = 0; i < numPoints; i++) {
            const base = 20 + (i * 60 / numPoints);
            const variation = Math.random() * 15 - 7;
            points.push(Math.max(10, Math.min(90, base + variation)));
        }
        return points;
    };

    const trendData = generateTrendData();

    // Create SVG path for line chart
    const createPath = () => {
        const width = 100;
        const height = 80;
        const points = trendData.map((y, i) => {
            const x = (i / (trendData.length - 1)) * width;
            const yPos = height - (y / 100) * height;
            return `${x},${yPos}`;
        });
        return `M${points.join(' L')}`;
    };

    // Create gradient fill path
    const createFillPath = () => {
        const width = 100;
        const height = 80;
        const points = trendData.map((y, i) => {
            const x = (i / (trendData.length - 1)) * width;
            const yPos = height - (y / 100) * height;
            return `${x},${yPos}`;
        });
        return `M0,${height} L${points.join(' L')} L${width},${height} Z`;
    };

    const periodLabels = period === '24h'
        ? ['00:00', '06:00', '12:00', '18:00', '24:00']
        : period === '7d'
            ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            : ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-6 shadow-sm border border-gray-100 dark:border-gray-700 h-full flex flex-col overflow-hidden transition-colors duration-300">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-bold text-lg text-brown-dark dark:text-gray-100">Revenue Trend</h3>
                    <p className="text-gray-400 text-sm dark:text-gray-400">Monthly earnings overview</p>
                </div>
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5 transition-colors">
                    {(['30d', '7d', '24h'] as const).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${period === p
                                ? 'bg-white dark:bg-gray-600 text-brown-dark dark:text-gray-100 shadow-sm'
                                : 'text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                                }`}
                        >
                            {p === '30d' ? '30 Days' : p === '7d' ? '7 Days' : '24 Hours'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Revenue Value */}
            <div className="flex items-baseline gap-4 mb-6">
                <h2 className="text-3xl font-extrabold text-brown-dark dark:text-white">
                    {loading ? '...' : formatValue(revenue)}
                </h2>
                <span className="text-green-500 text-sm font-bold flex items-center gap-1">
                    <span className="text-xs">↑</span> {changePercent}%
                </span>
            </div>

            {/* Chart */}
            <div className="flex-1 relative h-[180px] max-h-[200px]">
                <svg
                    viewBox="0 0 100 80"
                    className="w-full h-full"
                    preserveAspectRatio="none"
                >
                    <defs>
                        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#FFC107" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#FFC107" stopOpacity="0.05" />
                        </linearGradient>
                    </defs>

                    <path
                        d={createFillPath()}
                        fill="url(#chartGradient)"
                    />

                    <path
                        d={createPath()}
                        fill="none"
                        stroke="#FFC107"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                    />
                </svg>
            </div>

            {/* X-axis labels */}
            <div className="flex justify-between mt-2 text-xs text-gray-400 dark:text-gray-500 font-medium">
                {periodLabels.slice(0, 5).map((label, idx) => (
                    <span key={idx}>{label}</span>
                ))}
            </div>
        </div>
    );
};

export default RevenueChart;
