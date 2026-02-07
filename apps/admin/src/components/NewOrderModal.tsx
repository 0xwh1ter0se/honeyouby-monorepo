import { useState, useEffect } from 'react';
import { X, Plus, Minus, Search, CreditCard, Banknote, QrCode, ShoppingBag } from 'lucide-react';
import { fetchInventoryStats, createOrder } from '../services/api';

const NewOrderModal = ({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) => {
    const [products, setProducts] = useState<any[]>([]);
    const [cart, setCart] = useState<{ id: number, name: string, price: number, quantity: number, image: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cash'); // cash, qris, transfer
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const loadProducts = async () => {
            const data = await fetchInventoryStats();
            if (data) {
                // Transform to simple list with image logic
                // Images are now available locally in admin/public folder
                const prods = data.products.map(p => ({
                    ...p,
                    image: `/menu-${p.name.toLowerCase().includes('choco') ? 'choco' :
                        p.name.toLowerCase().includes('matcha') ? 'matcha' :
                            p.name.toLowerCase().includes('taro') ? 'taro' :
                                p.name.toLowerCase().includes('strawberry') || p.name.toLowerCase().includes('berry') ? 'strawberry' :
                                    p.name.toLowerCase().includes('tiramiss') ? 'tiramissu' : 'original'}.png`
                }));
                setProducts(prods);
            }
            setLoading(false);
        };
        loadProducts();
    }, []);

    const addToCart = (product: any) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { id: product.id, name: product.name, price: product.price, quantity: 1, image: product.image }];
        });
    };

    const removeFromCart = (id: number) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const updateQuantity = (id: number, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                return { ...item, quantity: Math.max(1, item.quantity + delta) };
            }
            return item;
        }));
    };

    const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const handleProcessPayment = async () => {
        if (cart.length === 0) return;
        setSubmitting(true);
        try {
            const orderRes = await createOrder({
                items: cart.map(i => ({ productId: i.id, quantity: i.quantity })),
                paymentMethod,
                guestName: 'Walk-in Customer',
                source: 'store'
            });

            if (orderRes && orderRes.id) {
                // Auto-confirm logic could go here
            }
        } catch (e) {
            console.error(e);
        }
        setSubmitting(false);
        onSuccess();
        onClose();
    };

    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white dark:bg-gray-900 w-full max-w-5xl h-[85vh] rounded-[2.5rem] shadow-2xl relative z-10 flex overflow-hidden animate-scale-in transition-colors duration-300">

                {/* Left: Product Selection */}
                <div className="w-2/3 bg-gray-50 dark:bg-gray-800 p-8 flex flex-col transition-colors">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-extrabold text-brown-dark dark:text-white">New Order</h2>
                        <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 flex items-center px-4 py-2 w-72 transition-colors">
                            <Search className="text-gray-400 mr-2" size={18} />
                            <input
                                type="text" placeholder="Search menu..."
                                className="bg-transparent outline-none w-full text-sm font-medium dark:text-white placeholder:text-gray-400"
                                value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-3 gap-4 content-start">
                        {loading ? <p className="dark:text-gray-400">Loading menu...</p> : filteredProducts.map(product => (
                            <div
                                key={product.id}
                                onClick={() => addToCart(product)}
                                className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-gold/30 dark:hover:border-gold/30 cursor-pointer transition-all active:scale-95 group"
                            >
                                <div className="aspect-square rounded-xl bg-gray-50 dark:bg-gray-800 mb-3 overflow-hidden p-2">
                                    <img src={product.image} alt={product.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" />
                                </div>
                                <h4 className="font-bold text-brown-dark dark:text-gray-200 text-sm leading-tight mb-1">{product.name}</h4>
                                <div className="flex justify-between items-end">
                                    <span className="text-gold-dark dark:text-gold font-bold text-sm">Rp {(product.price / 1000).toFixed(0)}k</span>
                                    <button className="w-8 h-8 rounded-full bg-cream dark:bg-gray-700 text-gold-dark dark:text-gold flex items-center justify-center hover:bg-gold hover:text-white dark:hover:bg-gold dark:hover:text-white transition-colors">
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Cart & Payment */}
                <div className="w-1/3 bg-white dark:bg-gray-900 p-8 border-l border-gray-100 dark:border-gray-800 flex flex-col transition-colors">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-xl text-brown-dark dark:text-white">Current Order</h3>
                        <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                            <X size={18} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-6">
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-300 dark:text-gray-600 space-y-4">
                                <ShoppingBag size={48} />
                                <p className="font-medium text-sm">Cart is empty</p>
                            </div>
                        ) : cart.map(item => (
                            <div key={item.id} className="flex items-center gap-3">
                                <img src={item.image} className="w-12 h-12 rounded-lg bg-gray-50 dark:bg-gray-800 object-cover" />
                                <div className="flex-1">
                                    <h5 className="font-bold text-brown-dark dark:text-gray-200 text-sm">{item.name}</h5>
                                    <p className="text-xs text-gold-dark dark:text-gold font-bold">Rp {item.price.toLocaleString()}</p>
                                </div>
                                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-lg p-1">
                                    <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 rounded-md hover:bg-white dark:hover:bg-gray-700 shadow-sm flex items-center justify-center text-gray-500 dark:text-gray-400"><Minus size={12} /></button>
                                    <span className="text-xs font-bold w-4 text-center dark:text-white">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 rounded-md hover:bg-white dark:hover:bg-gray-700 shadow-sm flex items-center justify-center text-gray-500 dark:text-gray-400"><Plus size={12} /></button>
                                </div>
                                <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600"><X size={14} /></button>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl space-y-2 transition-colors">
                            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                                <span>Subtotal</span>
                                <span>Rp {totalPrice.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                                <span>Tax (0%)</span>
                                <span>-</span>
                            </div>
                            <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between font-extrabold text-lg text-brown-dark dark:text-white transition-colors">
                                <span>Total</span>
                                <span>Rp {totalPrice.toLocaleString()}</span>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase mb-2">Payment Method</p>
                            <div className="grid grid-cols-3 gap-2">
                                {['cash', 'qris', 'transfer'].map(method => (
                                    <button
                                        key={method}
                                        onClick={() => setPaymentMethod(method)}
                                        className={`py-3 rounded-xl flex flex-col items-center gap-1 text-[10px] font-bold uppercase transition-all border-2 ${paymentMethod === method ? 'border-gold bg-gold/5 dark:bg-gold/10 text-gold-dark dark:text-gold' : 'border-gray-100 dark:border-gray-700 text-gray-400 hover:border-gray-200 dark:hover:border-gray-600 bg-white dark:bg-gray-800'}`}
                                    >
                                        {method === 'cash' && <Banknote size={20} />}
                                        {method === 'qris' && <QrCode size={20} />}
                                        {method === 'transfer' && <CreditCard size={20} />}
                                        {method}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleProcessPayment}
                            disabled={cart.length === 0 || submitting}
                            className="w-full bg-gold hover:bg-gold-dark text-white font-bold rounded-xl py-4 shadow-lg shadow-gold/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                        >
                            {submitting ? 'Processing...' : `Charge Rp ${totalPrice.toLocaleString()}`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewOrderModal;
