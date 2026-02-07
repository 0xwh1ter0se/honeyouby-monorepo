import { useState, useEffect } from 'react';
import { X, Save, Image as ImageIcon } from 'lucide-react';
import { createBlog, updateBlog } from '../services/api';

interface BlogModalProps {
    onClose: () => void;
    onSuccess: () => void;
    initialData?: any;
}

const BlogModal = ({ onClose, onSuccess, initialData }: BlogModalProps) => {
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        image: '',
        isPublished: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                excerpt: initialData.excerpt || '',
                content: initialData.content || '',
                image: initialData.image || '',
                isPublished: initialData.isPublished || false
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (initialData) {
                await updateBlog(initialData.id, formData);
            } else {
                await createBlog(formData);
            }
            onSuccess();
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to save blog.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl animate-scale-in overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-brown-dark px-8 py-6 flex justify-between items-center shrink-0">
                    <h2 className="text-2xl font-bold text-gold">
                        {initialData ? 'Edit Blog' : 'Write New Blog'}
                    </h2>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 overflow-y-auto">
                    {error && (
                        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-bold mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase">Title</label>
                            <input
                                type="text"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-brown-dark font-bold focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold/50 transition-all"
                                placeholder="Blog Title..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase">Excerpt (Short Description)</label>
                            <textarea
                                name="excerpt"
                                rows={2}
                                value={formData.excerpt}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-brown-dark font-medium focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold/50 transition-all resize-none"
                                placeholder="Brief summary..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase">Image URL</label>
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

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase">Content</label>
                            <textarea
                                name="content"
                                rows={8}
                                required
                                value={formData.content}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-brown-dark font-medium focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold/50 transition-all"
                                placeholder="Write your story here..."
                            />
                        </div>

                        <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
                            <input
                                type="checkbox"
                                name="isPublished"
                                id="isPublished"
                                checked={formData.isPublished}
                                onChange={handleChange}
                                className="w-5 h-5 accent-gold cursor-pointer"
                            />
                            <label htmlFor="isPublished" className="font-bold text-gray-700 cursor-pointer select-none">
                                Publish Immediately
                            </label>
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
                                        <span>Save Blog</span>
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

export default BlogModal;
