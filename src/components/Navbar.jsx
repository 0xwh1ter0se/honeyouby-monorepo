import React from 'react';
import { ShoppingCart, Menu as MenuIcon, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar({ cartCount, toggleCart }) {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="sticky top-0 w-full z-50 bg-background/90 backdrop-blur-sm border-b-4 border-secondary shadow-lg"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex-shrink-0 flex items-center gap-2">
                        {/* Logo - Sweet & Cute Image Logo */}
                        <img
                            src="/logo.png"
                            alt="HoneyOuby Logo"
                            className="h-12 md:h-16 w-auto object-contain hover:scale-105 transition-transform duration-300 transform drop-shadow-sm"
                        />
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        {[
                            { name: 'Home', path: '/#home' },
                            { name: 'Menu', path: '/#menu' },
                            { name: 'Blogs', path: '/#blogs' },
                            { name: 'Contact', path: '/#contact' },
                            { name: 'Status', path: '/status' }
                        ].map((item) => (
                            <a
                                key={item.name}
                                href={item.path}
                                className="text-primary hover:text-secondary font-bold text-lg transition-colors"
                            >
                                {item.name}
                            </a>
                        ))}

                        <button
                            onClick={toggleCart}
                            className="relative p-2 bg-secondary rounded-full hover:bg-yellow-400 transition-transform hover:scale-110 shadow-md"
                        >
                            <ShoppingCart className="h-6 w-6 text-primary" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-bounce">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>

                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-primary p-2"
                        >
                            {isOpen ? <X size={28} /> : <MenuIcon size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="md:hidden bg-background border-t border-secondary"
                >
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {[
                            { name: 'Home', path: '/#home' },
                            { name: 'Menu', path: '/#menu' },
                            { name: 'Blogs', path: '/#blogs' },
                            { name: 'Contact', path: '/#contact' },
                            { name: 'Status', path: '/status' }
                        ].map((item) => (
                            <a
                                key={item.name}
                                href={item.path}
                                className="block px-3 py-2 rounded-md text-base font-bold text-primary hover:bg-secondary/20"
                                onClick={() => setIsOpen(false)}
                            >
                                {item.name}
                            </a>
                        ))}
                        <button
                            onClick={() => {
                                toggleCart();
                                setIsOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 rounded-md text-base font-bold text-primary hover:bg-secondary/20 flex items-center gap-2"
                        >
                            <ShoppingCart size={20} /> Cart ({cartCount})
                        </button>
                    </div>
                </motion.div>
            )}
        </motion.nav>
    );
}
