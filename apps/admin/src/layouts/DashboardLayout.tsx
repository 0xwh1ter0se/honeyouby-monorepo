import { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Receipt,
    Package,
    BarChart3,
    Settings,
    LogOut,
    Bell,
    Plus,
    ShoppingBag,
    FileText
} from 'lucide-react';
import { Outlet, NavLink } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { fetchOrders } from '../services/api';
import { useNavigate } from 'react-router-dom';
import NewOrderModal from '../components/NewOrderModal';

const SidebarItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                ? 'bg-cream text-gold-dark font-semibold shadow-sm dark:bg-brown-dark dark:text-gold'
                : 'text-gray-500 hover:bg-white hover:text-gold-dark dark:text-gray-400 dark:hover:bg-gray-800'
            }`
        }
    >
        <Icon size={20} />
        <span>{label}</span>
    </NavLink>
);

export const DashboardLayout = () => {
    const { logout, user } = useAuth();
    const isOwner = user?.role === 'owner' || user?.role === 'manager';
    const [showNewOrderModal, setShowNewOrderModal] = useState(false);

    const navigate = useNavigate();
    const [pendingCount, setPendingCount] = useState(0);

    useEffect(() => {
        const checkNotifications = async () => {
            try {
                const orders = await fetchOrders('pending');
                setPendingCount(orders.length);
            } catch (error) {
                console.error('Failed to check notifications', error);
            }
        };

        checkNotifications();
        const interval = setInterval(checkNotifications, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex h-screen bg-[#F9FAFB] dark:bg-gray-900 transition-colors duration-300">
            {/* ... Sidebar ... */}
            <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 flex flex-col p-6 transition-colors duration-300">
                {/* ... (No changes to sidebar content) ... */}
                <div className="flex items-center gap-3 px-2 mb-10">
                    <div className="w-14 h-14 bg-gold/20 rounded-full flex items-center justify-center text-gold-dark shadow-sm overflow-hidden">
                        <img src="/images/logo-ho-new.png" alt="HO! Logo" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg text-brown-dark dark:text-white leading-tight">HO! Finance</h1>
                        <p className="text-xs text-gray-400 font-medium">{user?.role === 'owner' ? 'Owner Admin' : 'Staff Mode'}</p>
                    </div>
                </div>

                <nav className="flex-1 space-y-2">
                    <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" />
                    <SidebarItem to="/transactions" icon={Receipt} label="Transactions" />
                    <SidebarItem to="/orders" icon={ShoppingBag} label="Orders" />
                    <SidebarItem to="/blogs" icon={FileText} label="Blogs" />

                    {/* Role Based Items */}
                    {isOwner && (
                        <>
                            <SidebarItem to="/inventory" icon={Package} label="Inventory" />
                            <SidebarItem to="/reports" icon={BarChart3} label="Reports" />
                        </>
                    )}

                    <SidebarItem to="/settings" icon={Settings} label="Settings" />
                </nav>

                <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-gold-dark hover:bg-gold/10 rounded-xl transition-colors font-semibold"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="flex h-20 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md px-8 items-center justify-between transition-colors duration-300 border-b border-gray-100 dark:border-gray-700">
                    <div>
                        <h2 className="text-2xl font-bold text-brown-dark dark:text-white flex items-center gap-2">
                            Welcome back, Admin!
                        </h2>
                        <p className="text-sm text-gold-dark font-medium">Here's what's happening with your store today.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/orders')}
                            className="p-3 rounded-full bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 text-gray-400 hover:text-gold-dark hover:border-gold/30 transition-all shadow-sm relative group"
                        >
                            <Bell size={20} className={pendingCount > 0 ? "animate-swing" : ""} />
                            {pendingCount > 0 && (
                                <>
                                    <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-800 animate-ping"></span>
                                    <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-gray-800 px-1 shadow-sm">
                                        {pendingCount}
                                    </span>
                                </>
                            )}
                        </button>
                        <button
                            onClick={() => setShowNewOrderModal(true)}
                            className="flex items-center gap-2 bg-gold hover:bg-gold-dark text-white px-5 py-3 rounded-full font-semibold shadow-lg shadow-gold/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                        >
                            <Plus size={18} />
                            <span>New Order</span>
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-8 pb-8">
                    <Outlet />
                </main>
            </div >

            {/* Modals */}
            {showNewOrderModal && (
                <NewOrderModal
                    onClose={() => setShowNewOrderModal(false)}
                    onSuccess={() => window.location.reload()}
                />
            )}


        </div >
    );
};
