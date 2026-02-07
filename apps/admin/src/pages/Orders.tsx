import { useState, useEffect } from 'react';
import { ShoppingBag, Clock, CheckCircle2, XCircle, ChevronRight, Package, Truck } from 'lucide-react';
import { fetchOrders, updateOrderStatus } from '../services/api';
import type { Order } from '../services/api';

const Orders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');

    const loadOrders = async () => {
        setLoading(true);
        try {
            const data = await fetchOrders();
            setOrders(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
        const interval = setInterval(loadOrders, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleUpdateStatus = async (id: number, status: string) => {
        if (!confirm(`Are you sure you want to mark this order as ${status}?`)) return;

        const res = await updateOrderStatus(id, status);
        if (res) {
            loadOrders(); // Refresh
        }
    };

    const filteredOrders = orders.filter(o => {
        if (activeTab === 'pending') {
            return o.status === 'pending' || o.status === 'processing';
        }
        return ['paid', 'delivered', 'cancelled', 'shipped'].includes(o.status);
    });

    const formatRupiah = (val: number) => `Rp ${val.toLocaleString('id-ID')}`;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'processing': return 'bg-blue-100 text-blue-700';
            case 'paid': return 'bg-green-100 text-green-700';
            case 'delivered': return 'bg-green-100 text-green-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    // ... (existing code)

    return (
        <div className="space-y-8 animate-fade-in relative z-0">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1 text-xs text-gray-400 font-medium">
                        <span>Admin</span>
                        <span>›</span>
                        <span className="text-gold-dark">Orders</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-brown-dark flex items-center gap-3">
                        Web Order Management
                    </h1>
                </div>

                <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-100">
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'pending' ? 'bg-gold text-white shadow' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        Pending Orders
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'history' ? 'bg-brown-dark text-white shadow' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        Order History
                    </button>
                </div>
            </div>

            {/* Order List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading && orders.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-gray-400">Loading orders...</div>
                ) : filteredOrders.length === 0 ? (
                    <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                        <ShoppingBag size={48} className="mx-auto text-gray-200 mb-4" />
                        <h3 className="text-lg font-bold text-gray-400">No Web Orders Found</h3>
                        <p className="text-gray-300 text-sm">Waiting for new orders from the website.</p>
                    </div>
                ) : (
                    filteredOrders.map(order => (
                        <div key={order.id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-lg text-brown-dark">#{order.id}</span>
                                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-400 font-medium flex items-center gap-1">
                                        <Clock size={12} /> {new Date(order.createdAt).toLocaleDateString()} • {new Date(order.createdAt).toLocaleTimeString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-extrabold text-xl text-gold-dark">{formatRupiah(order.total)}</p>
                                    <p className="text-xs text-gray-400 font-medium capitalize">{order.paymentMethod}</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-2">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Customer:</span>
                                    <span className="font-bold text-brown-dark">{order.guestName || "Guest User"}</span>
                                </div>
                                {order.notes && (
                                    <div className="text-xs text-gray-500 italic bg-yellow-50 p-2 rounded-lg border border-yellow-100">
                                        Note: {order.notes}
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            {order.status === 'pending' && (
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                                        className="py-3 rounded-xl border border-red-100 bg-red-50 text-red-600 font-bold text-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <XCircle size={16} /> Reject
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus(order.id, 'paid')}
                                        className="py-3 rounded-xl bg-gold text-white font-bold text-sm hover:bg-gold-dark transition-colors shadow-lg shadow-gold/20 flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle2 size={16} /> Confirm Paid
                                    </button>
                                </div>
                            )}

                            {order.status === 'paid' && (
                                <button
                                    onClick={() => handleUpdateStatus(order.id, 'processing')}
                                    className="w-full py-3 rounded-xl bg-blue-500 text-white font-bold text-sm hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                                >
                                    <Package className="w-4 h-4" /> Process Order
                                </button>
                            )}

                            {order.status === 'processing' && (
                                <button
                                    onClick={() => handleUpdateStatus(order.id, 'shipped')}
                                    className="w-full py-3 rounded-xl bg-purple-500 text-white font-bold text-sm hover:bg-purple-600 transition-colors shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
                                >
                                    <Truck className="w-4 h-4" /> Ship Order
                                </button>
                            )}

                            {/* ALWAYS Show Details Button now */}
                            <button
                                onClick={() => setSelectedOrder(order)}
                                className="w-full mt-3 py-3 rounded-xl border border-gray-100 text-gray-400 font-bold text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                            >
                                View Details <ChevronRight size={16} />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Order Details Modal - Moved outside to escape stacking context */}
            {selectedOrder && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-scale-in">
                        <div className="bg-[#8B4513] p-6 text-white flex justify-between items-center">
                            <div>
                                <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Transaction Details</p>
                                <h2 className="text-2xl font-extrabold">#{selectedOrder.id}</h2>
                            </div>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <XCircle size={24} />
                            </button>
                        </div>

                        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
                            {/* Status & Code */}
                            <div className="flex flex-col md:flex-row gap-6 justify-between items-start p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Transaction Code</p>
                                    <p className="font-mono font-bold text-gray-600 bg-white px-3 py-1 rounded border border-gray-200">
                                        TRX-{new Date(selectedOrder.createdAt).getFullYear()}-{selectedOrder.id.toString().padStart(6, '0')}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Status</p>
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(selectedOrder.status)}`}>
                                        {selectedOrder.status}
                                    </span>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Customer Info */}
                                <div>
                                    <h3 className="font-bold text-[#8B4513] text-lg mb-4 flex items-center gap-2">
                                        <ShoppingBag size={18} /> Customer Details
                                    </h3>
                                    <div className="space-y-3 text-sm">
                                        <div>
                                            <p className="text-gray-400 font-medium text-xs">Name</p>
                                            <p className="font-bold text-gray-800">{selectedOrder.guestName || "Guest User"}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 font-medium text-xs">Email</p>
                                            <p className="font-medium text-gray-800">{selectedOrder.guestEmail || "-"}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 font-medium text-xs">Phone</p>
                                            <p className="font-medium text-gray-800">{selectedOrder.guestPhone || "-"}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Shipping Info */}
                                <div>
                                    <h3 className="font-bold text-[#8B4513] text-lg mb-4 flex items-center gap-2">
                                        <Truck size={18} /> Delivery Info
                                    </h3>
                                    <div className="space-y-3 text-sm">
                                        <div>
                                            <p className="text-gray-400 font-medium text-xs">Address</p>
                                            <p className="font-medium text-gray-800 leading-relaxed max-w-xs">{selectedOrder.shippingAddress || "-"}</p>
                                        </div>
                                        {selectedOrder.notes && (
                                            <div className="pt-2">
                                                <p className="text-gray-400 font-medium text-xs">Notes</p>
                                                <p className="text-xs italic bg-yellow-50 p-2 rounded text-gray-600 border border-yellow-100">{selectedOrder.notes}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Payment Info */}
                            <div>
                                <h3 className="font-bold text-[#8B4513] text-lg mb-4 flex items-center gap-2">
                                    Payment Details
                                </h3>
                                <div className="bg-[#FFF8E7] p-4 rounded-xl flex justify-between items-center border border-[#FFE082]">
                                    <div>
                                        <p className="text-[#8B4513]/60 text-xs font-bold uppercase">Total Amount</p>
                                        <p className="text-2xl font-extrabold text-[#8B4513]">{formatRupiah(selectedOrder.total)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[#8B4513]/60 text-xs font-bold uppercase">Method</p>
                                        <p className="font-bold text-[#8B4513] uppercase">{selectedOrder.paymentMethod}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 flex justify-end">
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="bg-white border border-gray-200 text-gray-600 px-6 py-2 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors"
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;
