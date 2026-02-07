import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { fetchInventoryStats } from '../services/api';

const TopSelling = () => {
    const [products, setProducts] = useState<Array<{
        name: string;
        stock: number;
        price: string;
        image: string;
    }>>([]);
    const [loading, setLoading] = useState(true);

    const loadProducts = async () => {
        try {
            const data = await fetchInventoryStats();
            if (data) {
                // Sort by lowest stock (assuming more sold = lower stock)
                const sorted = [...data.products]
                    .sort((a, b) => (a.stock || 0) - (b.stock || 0))
                    .slice(0, 3)
                    .map(p => ({
                        name: p.name,
                        stock: p.stock || 0,
                        price: `Rp ${(p.price / 1000).toFixed(0)}k`,
                        image: getProductImage(p.name)
                    }));
                setProducts(sorted);
            }
        } catch (error) {
            console.error('Failed to load products:', error);
        } finally {
            setLoading(false);
        }
    };

    const getProductImage = (name: string) => {
        const n = name.toLowerCase();
        if (n.includes('choco')) return '/menu-choco.png';
        if (n.includes('matcha')) return '/menu-matcha.png';
        if (n.includes('taro')) return '/menu-taro.png';
        if (n.includes('strawberry')) return '/menu-strawberry.png';
        if (n.includes('tiramiss')) return '/menu-tiramissu.png';
        return '/menu-original.png';
    };

    useEffect(() => {
        loadProducts();
        const interval = setInterval(loadProducts, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 h-full transition-colors duration-300">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-brown-dark dark:text-white flex items-center gap-2">
                    Top Products
                    {loading && <RefreshCw size={14} className="animate-spin text-gray-400" />}
                </h3>
                <Link to="/inventory" className="text-xs font-bold text-gold-dark hover:underline">View All</Link>
            </div>

            <div className="space-y-4">
                {products.length === 0 ? (
                    <p className="text-center text-gray-400 py-8 text-sm">
                        {loading ? 'Loading...' : 'No products found'}
                    </p>
                ) : (
                    products.map((product, index) => (
                        <div key={index} className="flex items-center gap-4 p-3 hover:bg-cream dark:hover:bg-white/5 rounded-2xl transition-colors cursor-pointer group">
                            <img src={product.image} alt={product.name} className="w-14 h-14 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform" />
                            <div className="flex-1">
                                <h4 className="font-bold text-brown-dark dark:text-gray-200 text-sm">{product.name}</h4>
                                <p className="text-xs text-gray-400">Stock: {product.stock}</p>
                            </div>
                            <span className="font-bold text-brown-dark dark:text-gold text-sm">{product.price}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TopSelling;
