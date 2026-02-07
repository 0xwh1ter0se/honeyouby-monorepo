import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Smartphone, QrCode, CheckCircle, Loader2 } from 'lucide-react';
import { useCreateOrder } from '../hooks';

// Random success messages - kekinian dan pujian
const SUCCESS_MESSAGES = [
    {
        title: "Makasih Udah Order! 🍠💛",
        subtitle: "Pesananmu sudah kami terima dengan baik.",
        quote: "Kamu emang the best! Selera makananmu top banget!"
    },
    {
        title: "Yeay, Order Berhasil! 🎉",
        subtitle: "Ubi manis sedang dalam perjalanan ke hatimu~",
        quote: "Slay banget sih kamu, pilihan menu-nya chef's kiss!"
    },
    {
        title: "Thank You, Bestie! 💕",
        subtitle: "Orderanmu sudah masuk ke sistem kami.",
        quote: "Literally kamu adalah customer paling kece hari ini!"
    },
    {
        title: "Order Confirmed! ✨",
        subtitle: "Siap-siap menikmati kelezatan Cilembu!",
        quote: "No cap, kamu punya taste yang premium banget!"
    },
    {
        title: "Wah, Mantap Jiwa! 🔥",
        subtitle: "Pesananmu langsung kami proses ya.",
        quote: "Real talk, pilihan kamu tuh gak ada obat!"
    },
    {
        title: "Terima Kasih Banyak! 🙏",
        subtitle: "Order kamu bikin kami semangat!",
        quote: "Kamu tuh bukan cuma sultan, tapi juga punya selera tinggi!"
    },
    {
        title: "Asiap, Order Masuk! 🚀",
        subtitle: "Ubi Cilembu premium dalam proses.",
        quote: "Gokil sih kamu, auto jadi pelanggan favorit kami!"
    },
    {
        title: "Cie yang Baru Order! 😍",
        subtitle: "Makasih udah pilih HoneyOuby!",
        quote: "Sabi banget, kamu emang beda dari yang lain!"
    },
];

export default function PaymentModal({ total, cartItems, onClose, onOrderSuccess }) {
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
    });
    const [step, setStep] = useState('info'); // 'info' | 'payment' | 'success'

    // Pick random success message on mount
    const successMessage = useMemo(() => {
        const randomIndex = Math.floor(Math.random() * SUCCESS_MESSAGES.length);
        return SUCCESS_MESSAGES[randomIndex];
    }, []);

    const createOrder = useCreateOrder();


    const PAYMENT_METHODS = [
        {
            category: "QRIS",
            icon: <QrCode className="text-primary" />,
            options: [
                { id: 'qris', name: 'QRIS' }
            ]
        },
        {
            category: "Bank Transfer",
            icon: <CreditCard className="text-secondary" />,
            options: [
                { id: 'bri', name: 'BRI' },
                { id: 'bni', name: 'BNI' },
                { id: 'bca', name: 'BCA' },
                { id: 'mandiri', name: 'Mandiri' },
                { id: 'seabank', name: 'Seabank' },
            ]
        },
        {
            category: "E-Wallet",
            icon: <Smartphone className="text-blue-500" />,
            options: [
                { id: 'shopeepay', name: 'ShopeePay' },
                { id: 'gopay', name: 'GoPay' },
                { id: 'dana', name: 'DANA' },
                { id: 'ovo', name: 'OVO' },
            ]
        }
    ];

    const handleSubmitInfo = (e) => {
        e.preventDefault();
        setStep('payment');
    };

    const [createdOrder, setCreatedOrder] = useState(null);

    const handlePayment = async () => {
        if (!selectedMethod) return;

        try {
            // Prepare order data
            const orderData = {
                guestName: customerInfo.name,
                guestEmail: customerInfo.email,
                guestPhone: customerInfo.phone,
                shippingAddress: customerInfo.address,
                paymentMethod: selectedMethod,
                items: cartItems.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                })),
            };

            // Create order via API
            const newOrder = await createOrder.mutateAsync(orderData);
            setCreatedOrder(newOrder);

            setStep('success');

            // Notify parent to clear cart
            if (onOrderSuccess) onOrderSuccess();

            // NOTE: Auto-close removed to let user see receipt

        } catch (error) {
            alert('Gagal membuat pesanan: ' + error.message);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="bg-primary p-6 text-white flex justify-between items-center shrink-0">
                        <h2 className="text-2xl font-bold">
                            {step === 'info' && 'Customer Info'}
                            {step === 'payment' && 'Select Payment'}
                            {step === 'success' && 'Order Confirmed!'}
                        </h2>
                        <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Success View - RECEIPT */}
                    {step === 'success' && (
                        <div className="p-8 text-center bg-[#FFF8E7] h-full overflow-y-auto">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', bounce: 0.5 }}
                            >
                                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                            </motion.div>

                            <h3 className="text-2xl font-extrabold text-[#8B4513] mb-2">{successMessage.title}</h3>
                            <p className="text-[#8B4513]/70 mb-6">{successMessage.subtitle}</p>

                            {/* Ticket / Receipt Card */}
                            <div className="bg-white p-6 rounded-2xl shadow-xl shadow-gray-200/50 mb-8 border border-gray-100 relative overflow-hidden">
                                {/* Decor: Ticket holes */}
                                <div className="absolute -left-3 top-1/2 w-6 h-6 bg-[#FFF8E7] rounded-full"></div>
                                <div className="absolute -right-3 top-1/2 w-6 h-6 bg-[#FFF8E7] rounded-full"></div>

                                <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Order ID</div>
                                <div className="text-3xl font-black text-[#8B4513] mb-4">
                                    #{createdOrder?.id}
                                </div>

                                <div className="border-t border-dashed border-gray-200 my-4"></div>

                                <div className="space-y-2 mb-4">
                                    {createdOrder?.items?.map((item, idx) => (
                                        <div key={idx} className="flex justify-between text-sm">
                                            <span className="text-gray-600 font-medium">{item.productName} x{item.quantity}</span>
                                            <span className="font-bold text-gray-800">Rp {(item.productPrice * item.quantity).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-dashed border-gray-200 my-4"></div>

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 font-bold">Total Paid</span>
                                    <span className="text-2xl font-black text-[#8B4513]">
                                        Rp {total.toLocaleString()}
                                    </span>
                                </div>
                                <div className="mt-2 text-xs text-gray-400 font-medium">
                                    via {selectedMethod} • {new Date().toLocaleDateString()}
                                </div>
                            </div>

                            <a
                                href={`/status?id=${createdOrder?.id}`}
                                className="block w-full bg-[#8B4513] text-[#FFC107] py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-[#6D360F] hover:shadow-xl transition-all mb-3"
                            >
                                🚀 Lacak Pesanan
                            </a>

                            <button
                                onClick={onClose}
                                className="block w-full text-gray-500 font-bold py-2 hover:text-gray-700 hover:bg-black/5 rounded-xl transition-all"
                            >
                                Tutup / Belanja Lagi
                            </button>
                        </div>
                    )}

                    {/* Customer Info Form */}
                    {step === 'info' && (
                        <form onSubmit={handleSubmitInfo} className="p-6 overflow-y-auto space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Nama Lengkap</label>
                                <input
                                    type="text"
                                    required
                                    value={customerInfo.name}
                                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-secondary outline-none"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={customerInfo.email}
                                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-secondary outline-none"
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">No. Telepon</label>
                                <input
                                    type="tel"
                                    required
                                    value={customerInfo.phone}
                                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value.replace(/\D/g, '') })}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-secondary outline-none"
                                    placeholder="08123456789"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Alamat Pengiriman</label>
                                <textarea
                                    required
                                    value={customerInfo.address}
                                    onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-secondary outline-none resize-none"
                                    rows={3}
                                    placeholder="Jl. Contoh No. 123, Kota..."
                                />
                            </div>

                            <div className="bg-yellow-50 p-4 rounded-xl border border-secondary text-center mt-4">
                                <p className="text-gray-500 text-sm mb-1">Total Pembayaran</p>
                                <p className="text-3xl font-extrabold text-primary">Rp {total.toLocaleString()}</p>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-primary text-secondary py-3 rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all mt-4"
                            >
                                Lanjut ke Pembayaran
                            </button>
                        </form>
                    )}

                    {/* Payment Selection */}
                    {step === 'payment' && (
                        <>
                            <div className="p-6 overflow-y-auto">
                                <div className="mb-6 bg-yellow-50 p-4 rounded-xl border border-secondary text-center">
                                    <p className="text-gray-500 text-sm mb-1">Total to Pay</p>
                                    <p className="text-3xl font-extrabold text-primary">Rp {total.toLocaleString()}</p>
                                </div>

                                <div className="space-y-6">
                                    {PAYMENT_METHODS.map((method, idx) => (
                                        <div key={idx}>
                                            <h3 className="flex items-center gap-2 font-bold text-gray-700 mb-3 border-b pb-2">
                                                {method.icon}
                                                {method.category}
                                            </h3>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                {method.options.map((option) => (
                                                    <button
                                                        key={option.id}
                                                        onClick={() => setSelectedMethod(option.name)}
                                                        className={`p-3 rounded-xl border-2 transition-all text-sm font-bold flex items-center justify-center text-center
                                                            ${selectedMethod === option.name
                                                                ? 'border-secondary bg-secondary/10 text-primary'
                                                                : 'border-gray-100 hover:border-gray-200 text-gray-600'
                                                            }`}
                                                    >
                                                        {option.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-6 border-t border-gray-100 shrink-0 space-y-3">
                                <button
                                    onClick={() => setStep('info')}
                                    className="w-full bg-gray-100 text-gray-700 py-3 rounded-full font-bold hover:bg-gray-200 transition-all"
                                >
                                    ← Kembali
                                </button>
                                <button
                                    onClick={handlePayment}
                                    disabled={!selectedMethod || createOrder.isPending}
                                    className="w-full bg-primary text-secondary py-3 rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                                >
                                    {createOrder.isPending ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        'Bayar Sekarang'
                                    )}
                                </button>
                            </div>
                        </>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
