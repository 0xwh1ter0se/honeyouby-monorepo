import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

export default function ProductCard({ product, addToCart, onViewDetails }) {
    return (
        <motion.div
            whileHover={{ y: -10 }}
            className="bg-white rounded-2xl overflow-hidden shadow-lg border-2 border-transparent hover:border-secondary transition-all duration-300"
        >
            <div className="h-48 overflow-hidden relative group cursor-pointer" onClick={onViewDetails}>
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-bold bg-primary/80 px-4 py-1 rounded-full backdrop-blur-sm">View Details</span>
                </div>
            </div>

            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-primary">{product.name}</h3>
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-bold">
                        {Array.isArray(product.category) ? product.category.join(', ') : product.category}
                    </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

                <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                        <span className="text-2xl font-extrabold text-primary">
                            Rp {product.price.toLocaleString()}
                        </span>
                        <span className={`text-sm font-medium ${product.stock === 0 ? 'text-red-500' : 'text-gray-400'}`}>
                            Stock: {product.stock === 0 ? 'Habis' : product.stock}
                        </span>
                    </div>
                    <motion.button
                        whileTap={product.stock > 0 ? { scale: 0.95 } : {}}
                        onClick={() => product.stock > 0 && addToCart(product)}
                        disabled={product.stock === 0}
                        className={`p-2 rounded-full shadow-md flex items-center gap-1 px-4 transition-all ${product.stock === 0
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-primary text-secondary hover:bg-primary/90'
                            }`}
                    >
                        {product.stock === 0 ? (
                            <span className="text-sm font-bold">Sold Out</span>
                        ) : (
                            <>
                                <Plus size={18} /> <span className="text-sm font-bold">Add</span>
                            </>
                        )}
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}
