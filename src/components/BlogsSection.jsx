import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useBlogs } from '../hooks';

const FALLBACK_BLOGS = [
    {
        id: 1,
        title: "Manfaat Ubi Cilembu untuk Kesehatan",
        excerpt: "Ketahui kandungan nutrisi dan manfaat luar biasa dari ubi Cilembu untuk tubuh Anda.",
        image: "/new-product-bg.jpg",
        publishedAt: "Jan 28, 2026"
    },
    {
        id: 2,
        title: "Rahasia Manisnya Madu Ubi Cilembu",
        excerpt: "Kenapa ubi Cilembu bisa mengeluarkan cairan seperti madu? Simak penjelasannya di sini.",
        image: "/new-product-bg.jpg",
        publishedAt: "Jan 25, 2026"
    },
    {
        id: 3,
        title: "Cara Terbaik Menikmati HoneyOuby",
        excerpt: "Tips penyajian dan topping terbaik untuk memaksimalkan rasa HoneyOuby favoritmu.",
        image: "/new-product-bg.jpg",
        publishedAt: "Jan 20, 2026"
    }
];

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function BlogsSection() {
    const { data: blogsData = [] } = useBlogs();
    const blogs = blogsData.length > 0 ? blogsData : FALLBACK_BLOGS;

    return (
        <section id="blogs" className="py-20 bg-background/50">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Latest Blogs</h2>
                    <p className="text-xl text-primary/80">Cerita manis seputar dunia HoneyOuby</p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {blogs.map((blog, index) => (
                        <motion.div
                            key={blog.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow border-2 border-secondary/20"
                        >
                            <div className="h-48 overflow-hidden">
                                <img
                                    src={blog.image}
                                    alt={blog.title}
                                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-6">
                                <span className="text-sm font-bold text-secondary mb-2 block">
                                    {formatDate(blog.publishedAt)}
                                </span>
                                <h3 className="text-xl font-bold text-primary mb-3 line-clamp-2">{blog.title}</h3>
                                <p className="text-gray-600 mb-4 line-clamp-3">{blog.excerpt}</p>
                                {blog.slug ? (
                                    <Link
                                        to={`/blog/${blog.slug}`}
                                        className="text-secondary font-bold hover:text-accent transition-colors flex items-center gap-1 group"
                                    >
                                        Baca Selengkapnya
                                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                                    </Link>
                                ) : (
                                    <button className="text-secondary font-bold hover:text-accent transition-colors flex items-center gap-1 group">
                                        Baca Selengkapnya
                                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
