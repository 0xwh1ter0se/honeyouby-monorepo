import { useState, useEffect } from 'react';
import { Package, AlertTriangle, Plus, Search, Edit, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import AddProductModal from '../components/AddProductModal';
import { fetchInventoryStats } from '../services/api';
import type { InventoryStats } from '../services/api';

const Inventory = () => {
    const [inventoryStats, setInventoryStats] = useState<InventoryStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);

    const handleEdit = (product: any) => {
        // Need to pass raw data or formatted data correctly. 
        // The API returns simple object, but we mapped it. 
        // Best to find original product from inventoryStats
        const original = inventoryStats?.products.find(p => p.id === parseInt(product.id.split('-')[1]));
        if (original) {
            setEditingProduct(original);
            setShowModal(true);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingProduct(null);
    };

    const handleSuccess = () => {
        handleCloseModal();
        loadInventory();
    };

    const loadInventory = async () => {
        setLoading(true);
        try {
            const data = await fetchInventoryStats();
            setInventoryStats(data);
        } catch (error) {
            console.error('Failed to load inventory:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadInventory();
        // Auto-refresh every 30 seconds
        const interval = setInterval(loadInventory, 30000);
        return () => clearInterval(interval);
    }, []);

    // Transform API data to display format
    const getInventoryItems = () => {
        if (!inventoryStats) return [];

        return inventoryStats.products.map((product) => ({
            id: `HO-${String(product.id).padStart(3, '0')}`,
            name: product.name,
            category: 'Sweet Menu',
            stock: product.stock || 0,
            minStock: 20,
            unit: 'box',
            price: `Rp ${product.price.toLocaleString('id-ID')}`,
            status: (product.stock || 0) === 0 ? 'Out of Stock' : (product.stock || 0) <= 20 ? 'Low Stock' : 'In Stock',
            image: `/menu-${product.name.toLowerCase().includes('choco') ? 'choco' :
                product.name.toLowerCase().includes('matcha') ? 'matcha' :
                    product.name.toLowerCase().includes('taro') ? 'taro' :
                        product.name.toLowerCase().includes('strawberry') ? 'strawberry' :
                            product.name.toLowerCase().includes('tiramiss') ? 'tiramissu' : 'original'}.png`
        }));
    };

    const inventory = getInventoryItems();

    const filteredInventory = inventory.filter(item => {
        if (activeTab === 'all') return true;
        if (activeTab === 'menu') return item.category === 'Sweet Menu';
        if (activeTab === 'raw') return item.category === 'Raw Material';
        return true;
    });

    const getStockColor = (stock: number, minStock: number) => {
        if (stock === 0) return 'bg-red-500';
        if (stock <= minStock) return 'bg-orange-400';
        return 'bg-green-500';
    };

    const getStockLabelColor = (stock: number, minStock: number) => {
        if (stock === 0) return 'text-red-500';
        if (stock <= minStock) return 'text-orange-500';
        return 'text-green-600';
    };

    const formatRupiah = (value: number) => {
        if (value >= 1000000) {
            return `Rp ${(value / 1000000).toFixed(1)}M`;
        }
        return `Rp ${value.toLocaleString('id-ID')}`;
    };

    return (
        <div className="animate-fade-in space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1 text-xs text-gray-400 font-medium">
                        <span>Admin</span>
                        <span>›</span>
                        <span className="text-gold-dark">Inventaris</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-brown-dark flex items-center gap-3">
                        Inventory: Menu & Stock
                        {loading && <RefreshCw size={20} className="animate-spin text-gray-400" />}
                    </h1>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={loadInventory}
                        className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl font-bold text-brown-dark hover:bg-gray-50 transition-all"
                    >
                        <RefreshCw size={18} />
                        <span>Refresh</span>
                    </button>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-gold hover:bg-gold-dark text-white rounded-xl font-bold shadow-lg shadow-gold/30 transition-all"
                    >
                        <Plus size={18} />
                        <span>Add Item</span>
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Products */}
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 font-medium text-sm mb-2">Total Menu Items</p>
                            <h2 className="text-4xl font-extrabold text-brown-dark mb-2">
                                {inventoryStats?.totalProducts || 0} <span className="text-lg font-medium text-gray-400">Variants</span>
                            </h2>
                            <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-md">Ready to Serve</span>
                        </div>
                        <div className="w-12 h-12 bg-cream rounded-xl flex items-center justify-center text-gold-dark">
                            <Package size={24} />
                        </div>
                    </div>
                </div>

                {/* Low Stock Alert */}
                <div className="bg-orange-50 p-6 rounded-[2rem] shadow-sm border border-orange-100 relative overflow-hidden">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-orange-600 font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-1">
                                <AlertTriangle size={14} /> Stock Alert
                            </p>
                            <h2 className="text-2xl font-extrabold text-brown-dark mb-1">
                                {inventoryStats?.lowStock || 0} Low Stock
                            </h2>
                            <p className="text-sm font-bold text-red-500 mb-4">
                                {inventoryStats?.outOfStock || 0} Out of Stock
                            </p>
                            <div className="w-full bg-orange-200 rounded-full h-2 mb-2">
                                <div
                                    className="bg-orange-500 h-2 rounded-full"
                                    style={{ width: `${inventoryStats ? ((inventoryStats.totalProducts - inventoryStats.lowStock) / inventoryStats.totalProducts) * 100 : 0}%` }}
                                ></div>
                            </div>
                        </div>
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-orange-500 shadow-sm">
                            <Package size={24} />
                        </div>
                    </div>
                </div>

                {/* Total Stock Value */}
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-gray-500 font-medium text-sm mb-2">Est. Asset Value</p>
                            <h2 className="text-3xl font-extrabold text-brown-dark">
                                {formatRupiah(inventoryStats?.totalValue || 0)}
                            </h2>
                        </div>
                        <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center text-gold-dark font-bold text-lg">$</div>
                    </div>
                    <div>
                        <div className="w-full h-2 bg-gray-100 rounded-full mb-1">
                            <div className="h-full bg-gold rounded-full w-3/4"></div>
                        </div>
                        <p className="text-[10px] text-gray-400 text-right">Auto-synced with database</p>
                    </div>
                </div>
            </div>

            {/* Tabs & Search */}
            <div className="bg-white p-2 rounded-[1.5rem] border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex-1 w-full flex items-center px-4">
                    <Search className="text-gray-400 mr-3" size={20} />
                    <input
                        type="text"
                        placeholder="Search menu or raw materials..."
                        className="bg-transparent outline-none w-full text-sm font-medium text-brown-dark placeholder:text-gray-400 py-3"
                    />
                </div>
                <div className="flex items-center gap-2 p-1 w-full md:w-auto overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm whitespace-nowrap transition-all ${activeTab === 'all' ? 'bg-brown-dark text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                    >
                        All Stock
                    </button>
                    <button
                        onClick={() => setActiveTab('menu')}
                        className={`px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm whitespace-nowrap transition-all ${activeTab === 'menu' ? 'bg-gold text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                    >
                        Menu Products
                    </button>
                </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">
                                <th className="py-5 pl-8">ID</th>
                                <th className="py-5">Product / Material</th>
                                <th className="py-5">Category</th>
                                <th className="py-5 w-1/4">Stock Level</th>
                                <th className="py-5">Price Ref</th>
                                <th className="py-5 pr-8 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading && inventory.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-gray-400">
                                        Loading inventory...
                                    </td>
                                </tr>
                            ) : filteredInventory.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-gray-400">
                                        No products found
                                    </td>
                                </tr>
                            ) : (
                                filteredInventory.map((item) => (
                                    <tr key={item.id} className="hover:bg-cream/30 transition-colors">
                                        <td className="py-5 pl-8 text-sm font-bold text-gold-dark">{item.id}</td>
                                        <td className="py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm bg-gray-100">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-brown-dark text-sm">{item.name}</h4>
                                                    <p className="text-xs text-gray-400">Unit: {item.unit}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-5">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.category === 'Raw Material' ? 'bg-orange-100 text-orange-700' :
                                                'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="py-5 pr-8">
                                            <div className="flex justify-between text-xs font-bold mb-1.5">
                                                <span className={getStockLabelColor(item.stock, item.minStock)}>
                                                    {item.stock} {item.unit}
                                                </span>
                                                <span className="text-gray-400">Min: {item.minStock}</span>
                                            </div>
                                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${getStockColor(item.stock, item.minStock)}`}
                                                    style={{ width: `${Math.min((item.stock / (item.minStock * 5)) * 100, 100)}%` }}
                                                ></div>
                                            </div>
                                            <p className={`text-[10px] mt-1 font-bold ${getStockLabelColor(item.stock, item.minStock)}`}>
                                                {item.status}
                                            </p>
                                        </td>
                                        <td className="py-5 text-sm font-bold text-brown-dark">{item.price}</td>
                                        <td className="py-5 pr-8 text-right">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors"
                                            >
                                                <Edit size={14} /> Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-6 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-sm text-gray-400 font-medium">
                        Showing <span className="font-bold text-brown-dark">{filteredInventory.length}</span> of <span className="font-bold text-brown-dark">{inventory.length}</span> results
                    </p>
                    <div className="flex gap-2">
                        <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-brown-dark hover:border-gold"><ChevronLeft size={16} /></button>
                        <button className="w-8 h-8 rounded-full bg-gold text-white font-bold text-xs shadow-md">1</button>
                        <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-brown-dark hover:border-gold"><ChevronRight size={16} /></button>
                    </div>
                </div>
            </div>


            {
                showModal && (
                    <AddProductModal
                        onClose={handleCloseModal}
                        onSuccess={handleSuccess}
                        initialData={editingProduct}
                    />
                )
            }
        </div>
    );
};

export default Inventory;
