import { useState, useEffect } from 'react';
import { Calendar, FileText, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { fetchDashboardStats, fetchDailyReports } from '../services/api';
import type { DailyReport } from '../services/api';

const Reports = () => {
    const [stats, setStats] = useState<any>(null);
    const [period, setPeriod] = useState('30d');
    const [loading, setLoading] = useState(true);
    const [reports, setReports] = useState<DailyReport[]>([]);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // Fetch up to 30 reports to support "View All"
                const [statsData, reportsData] = await Promise.all([
                    fetchDashboardStats(period as any),
                    fetchDailyReports(30)
                ]);
                setStats(statsData);
                setReports(reportsData);
            } catch (error) {
                console.error("Failed to load report data", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [period]);

    // Use dynamic chart data from stats, fallback to empty array if loading/not available
    const chartData = stats?.chartData || [];

    // Use dynamic pie data from stats, fallback to default if missing
    const defaultPieData = [
        { name: 'Raw Materials', value: 33 },
        { name: 'Packaging', value: 25 },
        { name: 'Marketing', value: 25 },
        { name: 'Operational', value: 17 },
    ];

    // Add default colors for pie chart segments
    const COLORS = ['#FACC15', '#8B4513', '#FEF3C7', '#A8A29E', '#ec4899', '#3b82f6'];

    const sourceData = (stats?.pieData && stats.pieData.length > 0) ? stats.pieData : defaultPieData;

    const pieData = sourceData.map((item: any, index: number) => ({
        ...item,
        color: COLORS[index % COLORS.length]
    }));

    // Function to generate and download CSV for a single report


    // New Function to export ALL currently available reports as a summary CSV


    const formatRupiah = (val: number) => {
        if (typeof val !== 'number') return 'Rp 0';
        if (val >= 1000000000) return `Rp ${(val / 1000000000).toFixed(1)}B`;
        if (val >= 1000000) return `Rp ${(val / 1000000).toFixed(1)}M`;
        return `Rp ${(val / 1000).toFixed(0)}K`;
    };

    // Determine displayed reports based on view all state
    const displayedReports = showAll ? reports : reports.slice(0, 3);

    return (
        <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1 text-xs text-gray-400 font-medium">
                        <span>Admin</span>
                        <span>›</span>
                        <span className="text-gold-dark">Financial Reports</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-brown-dark dark:text-white">
                        Financial Overview
                    </h1>
                </div>

                <div className="flex gap-3">
                    <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 shadow-sm transition-colors">
                        <Calendar size={16} className="mr-2 text-gray-400" />
                        <select
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            className="bg-transparent outline-none cursor-pointer dark:bg-gray-800"
                        >
                            <option value="7d">Last 7 Days</option>
                            <option value="30d">Last 30 Days</option>
                            <option value="90d">Last 3 Months</option>
                        </select>
                    </div>
                    {/* CHANGED: Export CSV Button */}

                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Net Profit - Hero Card */}
                <div className="bg-[#10B981] rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl shadow-green-500/20 group">
                    <div className="relative z-10">
                        <p className="text-white/80 font-medium mb-1">Net Profit</p>
                        <h2 className="text-4xl font-extrabold mb-4">
                            {loading ? '...' : formatRupiah(stats?.netProfit || 0)}
                        </h2>
                        <div className="inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-lg text-sm font-bold backdrop-blur-sm">
                            <ArrowUpRight size={14} />
                            <span>+12% vs period</span>
                        </div>
                    </div>
                    {/* Decorative Background Blob */}
                    <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500"></div>
                </div>

                {/* Expenses */}
                <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-8 border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                    <p className="text-gray-400 font-medium mb-1">Total Expenses</p>
                    <h2 className="text-4xl font-extrabold text-brown-dark dark:text-white mb-4">
                        {loading ? '...' : formatRupiah(stats?.expense || 0)}
                    </h2>
                    <div className="inline-flex items-center gap-1 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1 rounded-lg text-sm font-bold">
                        <ArrowDownRight size={14} />
                        <span>+4% vs period</span>
                    </div>
                </div>

                {/* Gross Income */}
                <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-8 border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                    <p className="text-gray-400 font-medium mb-1">Gross Income</p>
                    <h2 className="text-4xl font-extrabold text-brown-dark dark:text-white mb-4">
                        {loading ? '...' : formatRupiah(stats?.income || 0)}
                    </h2>
                    <div className="inline-flex items-center gap-1 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-3 py-1 rounded-lg text-sm font-bold">
                        <ArrowUpRight size={14} />
                        <span>+8% vs period</span>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue & Expenses Chart */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                    <h3 className="font-bold text-lg text-brown-dark dark:text-white mb-8">Monthly Revenue & Expenses</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" className="opacity-50 dark:opacity-20" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} tickFormatter={(value) => `${value / 1000}k`} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#F59E0B" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" name="Revenue" />
                                <Area type="monotone" dataKey="expense" stroke="#EF4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" name="Expenses" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Expense Breakdown */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center transition-colors duration-300">
                    <h3 className="font-bold text-lg text-brown-dark dark:text-white mb-8 self-start w-full">Expense Breakdown</h3>
                    <div className="flex flex-col md:flex-row items-center gap-8 w-full justify-center">
                        <div className="w-48 h-48 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Center Text */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <span className="text-2xl font-bold text-brown-dark dark:text-white">100%</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {pieData.map((item: any, index: number) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-24">{item.name}</span>
                                    <span className="text-sm font-bold text-brown-dark dark:text-gray-200">{item.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Generated Reports List */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg text-brown-dark dark:text-white">Recent Generated Reports ({reports.length})</h3>
                    {reports.length > 3 && (
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="text-gold text-sm font-bold hover:text-gold-dark transition-colors"
                        >
                            {showAll ? 'Show Less' : 'View All'}
                        </button>
                    )}
                </div>

                <div className="space-y-4">
                    {displayedReports.length > 0 ? (
                        displayedReports.map(report => (
                            <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl group hover:bg-gold/5 dark:hover:bg-gold/10 transition-colors cursor-pointer border border-transparent dark:border-gray-700">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-xl">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-brown-dark dark:text-gray-200 text-sm group-hover:text-gold-dark transition-colors">
                                            Daily_Report_{new Date(report.date).toLocaleDateString().replace(/\//g, '-')}.csv
                                        </h4>
                                        <p className="text-xs text-gray-400">Generated on {new Date(report.date).toDateString()}</p>
                                    </div>
                                </div>

                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-400 italic">
                            No daily reports generated yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Reports;
