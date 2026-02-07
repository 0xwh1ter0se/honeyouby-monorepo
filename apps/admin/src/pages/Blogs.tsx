import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, FileText } from 'lucide-react';
import { fetchBlogs, deleteBlog } from '../services/api';
import BlogModal from '../components/BlogModal';

const Blogs = () => {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState<any>(null);

    const loadBlogs = async () => {
        setLoading(true);
        try {
            const data = await fetchBlogs();
            setBlogs(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBlogs();
    }, []);

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this blog?')) {
            try {
                await deleteBlog(id);
                loadBlogs();
            } catch (error) {
                alert('Failed to delete blog');
            }
        }
    };

    const handleEdit = (blog: any) => {
        setSelectedBlog(blog);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setSelectedBlog(null);
        setIsModalOpen(true);
    };

    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1 text-xs text-gray-400 font-medium">
                        <span>Admin</span>
                        <span>›</span>
                        <span className="text-gold-dark">Blogs</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-brown-dark">Blog Management</h1>
                </div>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 bg-gold hover:bg-gold-dark text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-gold/30 transition-all transform hover:-translate-y-1 active:translate-y-0"
                >
                    <Plus size={20} />
                    <span>Write Blog</span>
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search blogs..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                    />
                </div>
            </div>

            {/* Blog List */}
            <div className="flex-1 overflow-hidden bg-white rounded-[2rem] shadow-sm border border-gray-100 flex flex-col">
                <div className="flex-1 overflow-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                            <tr>
                                <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Blog Info</th>
                                <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="text-right py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={3} className="py-12 text-center text-gray-400">
                                        Loading blogs...
                                    </td>
                                </tr>
                            ) : filteredBlogs.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="py-12 text-center text-gray-400">
                                        No blogs found. Start writing!
                                    </td>
                                </tr>
                            ) : (
                                filteredBlogs.map((blog) => (
                                    <tr key={blog.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                                                    {blog.image ? (
                                                        <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                            <FileText size={24} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-brown-dark group-hover:text-gold-dark transition-colors line-clamp-1">{blog.title}</h3>
                                                    <p className="text-sm text-gray-400 line-clamp-1">{blog.excerpt || 'No excerpt'}</p>
                                                    <div className="text-xs text-gray-300 mt-1">
                                                        {new Date(blog.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${blog.isPublished
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                {blog.isPublished ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(blog)}
                                                    className="p-2 text-gray-400 hover:bg-gold/10 hover:text-gold-dark rounded-lg transition-all"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(blog.id)}
                                                    className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <BlogModal
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={() => {
                        setIsModalOpen(false);
                        loadBlogs();
                    }}
                    initialData={selectedBlog}
                />
            )}
        </div>
    );
};

export default Blogs;
