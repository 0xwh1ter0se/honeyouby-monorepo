import { Home, Wallet, Package, Grid } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const BottomNav = () => {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 py-3 px-6 flex justify-between items-center z-50 md:hidden pb-safe transition-colors duration-300">
            <NavLink to="/" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-gold-dark dark:text-gold' : 'text-gray-400 dark:text-gray-500'}`}>
                <Home size={24} />
                <span className="text-[10px] font-bold">Home</span>
            </NavLink>
            <NavLink to="/transactions" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-gold-dark dark:text-gold' : 'text-gray-400 dark:text-gray-500'}`}>
                <Wallet size={24} />
                <span className="text-[10px] font-bold">Kas</span>
            </NavLink>
            <NavLink to="/inventory" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-gold-dark dark:text-gold' : 'text-gray-400 dark:text-gray-500'}`}>
                <Package size={24} />
                <span className="text-[10px] font-bold">Stok</span>
            </NavLink>
            <button className="flex flex-col items-center gap-1 text-gray-400 dark:text-gray-500">
                <Grid size={24} />
                <span className="text-[10px] font-bold">Menu</span>
            </button>
        </div>
    );
};

export default BottomNav;
