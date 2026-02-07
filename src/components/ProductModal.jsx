import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag } from 'lucide-react';

export default function ProductModal({ product, onClose, addToCart }) {
    if (!product) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden relative flex flex-col md:flex-row"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 p-2 bg-black/10 hover:bg-black/20 rounded-full transition-colors"
                    >
                        <X size={24} className="text-gray-700" />
                    </button>

                    {/* Image Section */}
                    <div className="w-full md:w-1/2 h-64 md:h-auto relative">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Content Section */}
                    <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
                        <div className="flex gap-2 mb-4">
                            {Array.isArray(product.category) ? product.category.map((cat, index) => (
                                <span key={index} className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                                    {cat}
                                </span>
                            )) : (
                                <span className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                                    {product.category}
                                </span>
                            )}
                        </div>

                        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">{product.name}</h2>

                        <p className="text-gray-600 text-lg leading-relaxed mb-8">
                            {product.description}
                        </p>

                        <div className="flex items-center justify-between mt-auto">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Price</p>
                                <p className="text-3xl font-extrabold text-primary">
                                    Rp {product.price.toLocaleString()}
                                </p>
                            </div>

                            <button
                                onClick={() => {
                                    if (product.stock > 0) {
                                        addToCart(product);
                                        onClose();
                                    }
                                }}
                                disabled={product.stock === 0}
                                className={`px-8 py-3 rounded-full font-bold text-lg transition-colors shadow-lg flex items-center gap-2 ${product.stock === 0
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-primary text-secondary hover:bg-primary/90'
                                    }`}
                            >
                                <ShoppingBag size={20} />
                                {product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
