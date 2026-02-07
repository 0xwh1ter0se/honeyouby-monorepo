import { useState, useEffect } from 'react';
import { X, Save, Image as ImageIcon } from 'lucide-react';
import { createProduct, updateProduct } from '../services/api';

interface AddProductModalProps {
    onClose: () => void;
    onSuccess: () => void;
    initialData?: any; // If provided, it's edit mode
}

const AddProductModal = ({ onClose, onSuccess, initialData }: AddProductModalProps) => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        stock: '',
        category: 'Sweet Menu', // Default
        image: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                price: initialData.price?.toString() || '',
                stock: initialData.stock?.toString() || '0',
                category: initialData.category || 'Sweet Menu',
                image: initialData.image || '',
                description: initialData.description || ''
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        let value = e.target.value;
        if (e.target.name === 'price' || e.target.name === 'stock') {
            value = value.replace(/\D/g, '');
        }
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload = {
                name: formData.name,
                price: parseInt(formData.price),
                stock: parseInt(formData.stock),
                image: formData.image, // Ideally handle file upload, but URL string for now
                description: formData.description,
                // category logic requires mapping ID, for now let's assume flat structure or handle ID in backend 
                // In product.routes.ts, categoryIds is optional.
            };

            if (initialData) {
                await updateProduct(initialData.id_raw || initialData.id, payload); // Using id_raw if id is formatted string
            } else {
                await createProduct(payload);
            }
            onSuccess();
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to save product. Check inputs.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl animate-scale-in overflow-hidden">
                {/* Header */}
                <div className="bg-brown-dark px-8 py-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gold">
                        {initialData ? 'Edit Product' : 'Add New Product'}
                    </h2>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8">
                    {error && (
                        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-bold mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase">Product Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-brown-dark font-bold focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold/50 transition-all"
                                    placeholder="e.g. Choco Lava"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase">Price (Rp)</label>
                                <input
                                    type="number"
                                    name="price"
                                    required
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-brown-dark font-bold focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold/50 transition-all"
                                    placeholder="e.g. 25000"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase">Stock</label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-brown-dark font-bold focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold/50 transition-all"
                                    placeholder="0"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-brown-dark font-bold focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold/50 transition-all appearance-none"
                                >
                                    <option>Sweet Menu</option>
                                    <option>Raw Material</option>
                                    <option>Packaging</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase">Image URL (Optional)</label>
                            <div className="relative">
                                <ImageIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 py-3 text-brown-dark font-medium focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold/50 transition-all"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={loading}
                                className="flex-1 py-4 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-[2] bg-gold hover:bg-gold-dark text-white py-4 rounded-xl font-bold shadow-lg shadow-gold/30 transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Save size={20} />
                                        <span>Save Product</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddProductModal;
