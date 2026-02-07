import React, { useState } from 'react';
import { Search } from 'lucide-react';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import { motion } from 'framer-motion';
import { useProducts, useCategories } from '../hooks';

const FALLBACK_CATEGORIES = ["All", "Best Seller", "Original", "Sweet"];

export default function MenuSection({ addToCart }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Fetch data using TanStack Query hooks
    const { data: products = [], isLoading: productsLoading } = useProducts({
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        search: searchTerm || undefined,
    });

    const { data: categoriesData = [] } = useCategories();

    const categories = categoriesData.length > 0
        ? ["All", ...categoriesData.map(c => c.name)]
        : FALLBACK_CATEGORIES;

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const productCategories = Array.isArray(product.category) ? product.category : [];
        const matchesCategory = selectedCategory === "All" || productCategories.includes(selectedCategory);
        return matchesSearch && matchesCategory;
    });

    return (
        <section id="menu" className="py-20 px-4 bg-background">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-primary mb-4"
                    >
                        Our Sweet Menu
                    </motion.h2>
                    <p className="text-xl text-gray-600">Discover our innovative Cilembu creations.</p>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search for ubi..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-full border-2 border-primary/20 focus:border-secondary focus:ring-2 focus:ring-secondary/50 outline-none transition-all"
                        />
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-hide">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-full font-bold whitespace-nowrap transition-all ${selectedCategory === category
                                    ? 'bg-primary text-secondary shadow-md scale-105'
                                    : 'bg-white text-primary border border-primary/20 hover:bg-yellow-50'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>



                {/* Product Grid */}
                {productsLoading ? (
                    <div className="text-center py-20">
                        <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-gray-500">Loading products...</p>
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProducts.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                addToCart={addToCart}
                                onViewDetails={() => setSelectedProduct(product)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-500">
                        <p className="text-2xl font-bold">No sweet potatoes found! 🍠</p>
                        <p>Try a different search term.</p>
                    </div>
                )}
            </div>

            {/* Product Modal */}
            {selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                    addToCart={addToCart}
                />
            )}
        </section>
    );
}
