import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string;
    change?: string | null;
    isPositive?: boolean;
    icon: LucideIcon;
    color: 'gold' | 'brown' | 'yellow' | 'green' | 'blue';
}

const StatsCard = ({ title, value, change, isPositive = true, icon: Icon, color }: StatsCardProps) => {
    const colorClasses = {
        gold: 'bg-gold/10 text-gold-dark dark:text-gold',
        brown: 'bg-brown/10 text-brown dark:text-orange-300',
        yellow: 'bg-yellow/20 text-yellow-600 dark:text-yellow-400',
        green: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
        blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between h-40 transition-colors duration-300">
            <div className="flex justify-between items-start">
                <span className="text-gray-500 dark:text-gray-400 font-medium text-sm">{title}</span>
                <div className={`p-2 rounded-xl ${colorClasses[color]}`}>
                    <Icon size={20} />
                </div>
            </div>
            <div>
                <h3 className="text-2xl font-bold text-brown-dark dark:text-white mb-2">{value}</h3>
                {change && (
                    <div className={`text-xs font-bold px-2 py-1 rounded-full inline-flex items-center gap-1 w-fit ${isPositive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                        {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {change} vs last month
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatsCard;
