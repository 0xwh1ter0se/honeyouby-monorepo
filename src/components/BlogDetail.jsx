import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBlog } from '../hooks';
import { ArrowLeft, Calendar, Clock, Share2 } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function BlogDetail() {
    const { slug } = useParams();
    const { data: blog, isLoading, error } = useBlog(slug);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center p-4">
                <h1 className="text-4xl font-bold text-primary mb-4">Blog Not Found</h1>
                <p className="text-gray-600 mb-8">Oops! The article you are looking for doesn't exist.</p>
                <Link to="/" className="bg-primary text-secondary px-6 py-3 rounded-full font-bold hover:bg-primary/90 transition-colors">
                    Back to Home
                </Link>
            </div>
        );
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-background font-sans">
            {/* Simple Navbar for Detail Page - Or reuse main Navbar if preferred, 
                 but reusing main navbar requires passing cart props etc. 
                 For simplicity, we'll make a dedicated nav or just a back button wrapper.
                 Let's assume we want full layout. We'll reuse Main Layout in App.jsx actually.
                 But for now, sticking to standalone structure unless we refactor Layout.
             */}

            <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <Link to="/" className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-primary ml-2">HoneyOuby</span>
                        </Link>
                        <Link to="/" className="text-primary font-bold hover:text-secondary flex items-center gap-2">
                            <ArrowLeft size={20} /> Back to Home
                        </Link>
                    </div>
                </div>
            </nav>

            <article className="pt-32 pb-20 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto"
                >
                    {/* Header */}
                    <div className="text-center mb-12">
                        <span className="inline-block px-4 py-1 rounded-full bg-secondary/20 text-primary font-bold text-sm mb-4">
                            Ubi Cilembu Series
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6 leading-tight">
                            {blog.title}
                        </h1>
                        <div className="flex items-center justify-center gap-6 text-gray-500 text-sm">
                            <span className="flex items-center gap-2">
                                <Calendar size={16} />
                                {formatDate(blog.publishedAt)}
                            </span>
                            <span className="flex items-center gap-2">
                                <Clock size={16} />
                                5 min read
                            </span>
                        </div>
                    </div>

                    {/* Featured Image */}
                    <div className="rounded-3xl overflow-hidden shadow-2xl mb-12 aspect-video relative">
                        <img
                            src={blog.image}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur p-2 rounded-full cursor-pointer hover:bg-white transition-colors" title="Share">
                            <Share2 className="text-primary" size={24} />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="prose prose-lg max-w-none prose-headings:text-primary prose-a:text-secondary text-gray-700 bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
                        {/* We'll render simple paragraphs for now. In real app might use a markdown renderer */}
                        {blog.content ? (
                            blog.content.split('\n\n').map((paragraph, idx) => (
                                <p key={idx} className="mb-6 leading-relaxed">
                                    {paragraph}
                                </p>
                            ))
                        ) : (
                            <p>No content available.</p>
                        )}

                        <div className="mt-12 p-6 bg-yellow-50 rounded-2xl border border-secondary/20">
                            <h3 className="text-xl font-bold text-primary mb-2">Mau cobain Ubi Cilembu yang asli?</h3>
                            <p className="mb-4">HoneyOuby menyediakan ubi cilembu kualitas terbaik dengan rasa madu alami.</p>
                            <Link to="/?section=menu" className="inline-block bg-primary text-secondary px-6 py-3 rounded-full font-bold hover:bg-primary/90 transition-all shadow-lg">
                                Pesan Sekarang
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </article>

            <Footer />
        </div>
    );
}
