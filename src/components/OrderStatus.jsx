import React, { useState } from 'react';
import { Search, Package, CheckCircle, Truck, Clock, XCircle, ArrowLeft } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { orderApi } from '../services/orderApi';

const OrderStatus = () => {
    const [searchParams] = useSearchParams();
    const [orderId, setOrderId] = useState(searchParams.get('id') || '');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);

    // Rating State
    const [deliveryRating, setDeliveryRating] = useState(0);
    const [productRatings, setProductRatings] = useState({});
    const [error, setError] = useState(null);

    // Effect to auto-search if ID is in URL
    React.useEffect(() => {
        const idFromUrl = searchParams.get('id');
        if (idFromUrl) {
            setOrderId(idFromUrl);
            fetchOrder(idFromUrl);
        }
    }, [searchParams]);

    const fetchOrder = async (id) => {
        if (!id) return;

        setLoading(true);
        setError(null);
        setOrder(null);

        try {
            // Remove # from ID if present
            const cleanId = String(id).replace('#', '');
            const data = await orderApi.getOrder(cleanId);
            setOrder(data);
        } catch (err) {
            console.error(err);
            if (err.message && err.message.includes('404')) {
                setError('Order not found. Please check your Order ID.');
            } else {
                setError('Failed to fetch order details. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchOrder(orderId);
    };

    // Helper to determine step status
    const getStepStatus = (stepId, currentStatus) => {
        const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];

        // Handle paid as pending for UI simplicity, or same level
        let normalizedStatus = currentStatus;
        if (currentStatus === 'paid') normalizedStatus = 'pending';

        if (currentStatus === 'cancelled') return 'cancelled';

        const currentIndex = statusOrder.indexOf(normalizedStatus);
        const stepIndex = statusOrder.indexOf(stepId);

        if (currentIndex > stepIndex) return 'completed';
        if (currentIndex === stepIndex) return 'current';
        return 'upcoming';
    };

    const steps = [
        { id: 'pending', label: 'Pesanan Diterima', icon: CheckCircle, description: 'Menunggu konfirmasi' },
        { id: 'processing', label: 'Sedang Diproses', icon: Package, description: 'Sedang disiapkan' },
        { id: 'shipped', label: 'Dalam Pengiriman', icon: Truck, description: 'Bersama kurir' },
        { id: 'delivered', label: 'Selesai', icon: Clock, description: 'Diterima' }
    ];

    return (
        <div className="min-h-screen bg-[#FFF8E7] font-sans">
            {/* Header */}
            <nav className="p-6">
                <Link to="/" className="inline-flex items-center gap-2 text-[#8B4513] font-bold hover:opacity-80 transition-opacity">
                    <ArrowLeft size={20} />
                    Back to Home
                </Link>
            </nav>

            <div className="max-w-3xl mx-auto px-6 py-8">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-[#8B4513] mb-4">
                        Lacak Pesanamu 🍯
                    </h1>
                    <p className="text-[#8B4513]/70">
                        Masukkan ID Pesanan untuk mengetahui status terkini Ubi Cilembu-mu!
                    </p>
                </div>

                {/* Search Box */}
                <div className="bg-white p-2 rounded-2xl shadow-lg shadow-[#8B4513]/5 mb-12 transform hover:scale-[1.01] transition-transform duration-300">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                                placeholder="Contoh: 7352"
                                className="w-full pl-12 pr-4 py-4 rounded-xl outline-none text-[#8B4513] placeholder:text-gray-300 font-medium text-lg"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !orderId}
                            className="bg-[#FFC107] text-[#8B4513] px-8 rounded-xl font-bold hover:bg-[#FFD54F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Mencari...' : 'Lacak'}
                        </button>
                    </form>
                </div>

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 mb-8 animate-fade-in">
                        <XCircle size={20} />
                        <span className="font-bold">{error}</span>
                    </div>
                )}

                {/* Result State */}
                {order && (
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-[#8B4513]/5 animate-scale-in">
                        <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-6">
                            <div>
                                <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Order ID</p>
                                <h2 className="text-3xl font-extrabold text-[#8B4513]">#{order.id}</h2>
                            </div>
                            <div className="flex items-center gap-3">
                                {order.status === 'shipped' && (
                                    <button
                                        onClick={async () => {
                                            if (confirm('Konfirmasi barang sudah diterima?')) {
                                                try {
                                                    await orderApi.receiveOrder(order.id);
                                                    fetchOrder(order.id);
                                                } catch (err) {
                                                    console.error(err);
                                                    alert('Gagal mengupdate status');
                                                }
                                            }
                                        }}
                                        className="hidden md:block bg-green-100 text-green-700 px-4 py-2 rounded-lg font-bold text-sm hover:bg-green-200 transition-colors"
                                    >
                                        Konfirmasi Terima Barang
                                    </button>
                                )}
                                <div className={`px-4 py-2 rounded-full font-bold text-sm ${order.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                                    order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                                        'bg-[#FFF8E7] text-[#DAA520]'
                                    }`}>
                                    {order.status.toUpperCase()}
                                </div>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="relative mb-10 pl-6 md:pl-0">
                            {/* Vertical Line for Mobile */}
                            <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gray-100 md:hidden"></div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 relative">
                                {/* Horizontal Line for Desktop */}
                                <div className="hidden md:block absolute top-[26px] left-[10%] right-[10%] h-1 bg-gray-100 -z-10"></div>

                                {/* "Order Received" Action Button (Only when Shipped) - Mobile Floating */}
                                {order.status === 'shipped' && (
                                    <div className="absolute top-0 right-0 left-0 -mt-16 text-center animate-bounce-soft md:hidden">
                                        <button
                                            onClick={async () => {
                                                if (confirm('Apakah barang sudah benar-benar diterima?')) {
                                                    try {
                                                        await orderApi.receiveOrder(order.id);
                                                        fetchOrder(order.id);
                                                    } catch (err) {
                                                        alert('Gagal mengupdate status');
                                                    }
                                                }
                                            }}
                                            className="bg-green-500 text-white px-6 py-2 rounded-full font-bold shadow-lg text-sm"
                                        >
                                            Saya Sudah Terima Barang
                                        </button>
                                    </div>
                                )}

                                {steps.map((step, idx) => {
                                    const status = getStepStatus(step.id, order.status);
                                    let colorClass = 'bg-gray-100 text-gray-400'; // Upcoming

                                    if (status === 'completed') {
                                        colorClass = 'bg-green-100 text-green-600 ring-4 ring-green-50';
                                    } else if (status === 'current') {
                                        colorClass = 'bg-[#FFC107] text-[#8B4513] ring-4 ring-[#FFF8E7] shadow-lg shadow-[#FFC107]/30 scale-110';
                                    } else if (order.status === 'cancelled') {
                                        colorClass = 'bg-red-50 text-red-300 opacity-50';
                                    }

                                    return (
                                        <div key={step.id} className="flex flex-row md:flex-col items-center gap-4 md:gap-3 relative z-10 bg-white md:bg-transparent p-2 md:p-0 rounded-xl">
                                            <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 ${colorClass}`}>
                                                <step.icon size={24} />
                                            </div>
                                            <div className="text-left md:text-center">
                                                <h4 className={`font-bold ${status === 'current' ? 'text-[#8B4513]' : 'text-gray-500'}`}>
                                                    {step.label}
                                                </h4>
                                                <p className="text-xs text-gray-400 font-medium text-balance">{step.description}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Rating Form (Only when Delivered and not yet rated) */}
                        {order.status === 'delivered' && !order.deliveryRating && (
                            <div className="mb-10 bg-white p-6 rounded-2xl shadow-sm border border-orange-100 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -mr-16 -mt-16 blur-xl"></div>
                                <h3 className="font-bold text-lg mb-4 text-[#8B4513] relative z-10">Beri Penilaian</h3>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="bg-orange-50 p-6 rounded-xl">
                                        <label className="block text-sm font-bold text-gray-600 mb-3 text-center">Pengiriman</label>
                                        <div className="flex justify-center gap-3">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    onClick={() => setDeliveryRating(star)}
                                                    className={`text-3xl transition-transform hover:scale-110 ${deliveryRating >= star ? 'text-yellow-400 drop-shadow-sm' : 'text-gray-200'}`}
                                                >
                                                    ★
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="block text-sm font-bold text-gray-600 mb-2">Produk</label>
                                        {order.items?.map((item) => (
                                            <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                                <span className="font-medium text-sm text-gray-700">{item.productName}</span>
                                                <div className="flex gap-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button
                                                            key={star}
                                                            onClick={() => {
                                                                const newRatings = { ...productRatings };
                                                                newRatings[item.productId] = star;
                                                                setProductRatings(newRatings);
                                                            }}
                                                            className={`text-lg transition-transform hover:scale-110 ${productRatings[item.productId] >= star ? 'text-yellow-400' : 'text-gray-200'}`}
                                                        >
                                                            ★
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={async () => {
                                        if (!deliveryRating) return alert('Mohon beri nilai pengiriman');

                                        const payload = {
                                            deliveryRating,
                                            productRatings: Object.keys(productRatings).map(pid => ({
                                                productId: parseInt(pid),
                                                rating: productRatings[pid]
                                            }))
                                        };

                                        try {
                                            await orderApi.submitRating(order.id, payload);
                                            alert('Terima kasih atas penilaian Anda!');
                                            fetchOrder(order.id);
                                        } catch (err) {
                                            alert('Gagal mengirim ulasan');
                                        }
                                    }}
                                    className="w-full mt-6 bg-[#8B4513] text-white py-3 rounded-xl font-bold shadow-lg shadow-orange-900/10 hover:shadow-orange-900/20 transition-all hover:-translate-y-0.5"
                                >
                                    Kirim Ulasan
                                </button>
                            </div>
                        )}

                        {/* Thank You Message (If Rated) */}
                        {order.deliveryRating && (
                            <div className="mb-10 bg-green-50 p-6 rounded-2xl text-center border border-green-100 flex flex-col items-center animate-scale-in">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">
                                    <CheckCircle size={24} />
                                </div>
                                <h3 className="font-bold text-green-700 text-lg mb-1">Terima Kasih!</h3>
                                <p className="text-green-600 text-sm">Ulasan Anda sangat berarti bagi kami.</p>
                            </div>
                        )}

                        {/* Order Items */}
                        <div className="bg-[#FAFAFA] rounded-2xl p-6">
                            <h3 className="font-bold text-[#8B4513] mb-4">Detail Pesanan</h3>
                            <div className="space-y-4">
                                {order.items && order.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-[#FFF8E7] flex items-center justify-center text-[#DAA520] font-bold text-xs">
                                                x{item.quantity}
                                            </div>
                                            <span className="font-medium text-gray-700">{item.productName}</span>
                                        </div>
                                        <span className="font-bold text-[#8B4513]">
                                            Rp {(item.productPrice * item.quantity).toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-dashed border-gray-300 mt-4 pt-4 flex justify-between items-center">
                                <span className="font-bold text-gray-500">Total</span>
                                <span className="font-extrabold text-xl text-[#8B4513]">
                                    Rp {order.total.toLocaleString('id-ID')}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderStatus;
