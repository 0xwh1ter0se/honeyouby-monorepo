import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import PaymentModal from './PaymentModal';

export default function CartSidebar({ isOpen, onClose, cartItems, removeFromCart, updateQuantity }) {
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col border-l-4 border-secondary"
                    >
                        <div className="p-6 bg-primary text-background flex justify-between items-center shadow-md">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <ShoppingBag /> Your Cart
                            </h2>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {cartItems.length === 0 ? (
                                <div className="text-center py-20 opacity-50">
                                    <ShoppingBag size={64} className="mx-auto mb-4 text-gray-300" />
                                    <p className="text-xl font-bold text-gray-400">Your cart is empty.</p>
                                    <p className="text-sm text-gray-400">Go add some sweet yams!</p>
                                </div>
                            ) : (
                                cartItems.map((item) => (
                                    <motion.div
                                        layout
                                        key={item.id}
                                        className="flex gap-4 items-center bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm"
                                    >
                                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                                        <div className="flex-1">
                                            <h3 className="font-bold text-primary">{item.name}</h3>
                                            <p className="text-sm text-gray-500 font-medium">Rp {item.price.toLocaleString()}</p>

                                            <div className="flex items-center gap-3 mt-2">
                                                <button
                                                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                    className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center font-bold hover:bg-gray-300"
                                                >
                                                    -
                                                </button>
                                                <span className="font-bold text-lg w-8 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-6 h-6 rounded-full bg-secondary text-primary flex items-center justify-center font-bold hover:bg-yellow-400"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        <div className="p-6 bg-gray-50 border-t border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-gray-600 font-bold">Total</span>
                                <span className="text-3xl font-extrabold text-primary">Rp {total.toLocaleString()}</span>
                            </div>
                            <button
                                onClick={() => setShowPaymentModal(true)}
                                disabled={cartItems.length === 0}
                                className="w-full bg-primary text-secondary py-4 rounded-xl font-bold text-xl shadow-lg hover:shadow-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Checkout
                            </button>
                        </div>
                    </motion.div>
                </>
            )}

            {/* Payment Modal */}
            {showPaymentModal && (
                <PaymentModal
                    total={total}
                    cartItems={cartItems}
                    onClose={() => setShowPaymentModal(false)}
                    onOrderSuccess={() => {
                        // Clear cart after successful order
                        cartItems.forEach(item => removeFromCart(item.id));
                        // Don't close modal here, let user see receipt
                    }}
                />
            )}
        </AnimatePresence>
    );
}
