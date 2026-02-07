import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const REVIEWS = [
    {
        id: 1,
        name: "Siti Nurhaliza",
        rating: 5,
        comment: "Ubi Cilembu paling enak yang pernah saya coba! Topping cokelatnya melimpah banget.",
        date: "2 hari yang lalu"
    },
    {
        id: 2,
        name: "Budi Santoso",
        rating: 4, // Intentionally 4 to average out near 4.6 visually if needed, but requests said 4.6 for home. This section shows individual reviews.
        comment: "Rasanya unik banget, perpaduan manis ubi sama saus taronya pas. Recommended!",
        date: "1 minggu yang lalu"
    },
    {
        id: 3,
        name: "Dewi Putri",
        rating: 5,
        comment: "Pengiriman cepat dan masih hangat pas sampai. Pasti bakal pesan lagi.",
        date: "3 hari yang lalu"
    }
];

export default function RatingSection() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Apa Kata Mereka?</h2>
                    <p className="text-xl text-primary/80">Ulasan jujur dari pelanggan setia HoneyOuby</p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {REVIEWS.map((review, index) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-background rounded-2xl p-8 shadow-lg border border-primary/10 hover:shadow-xl transition-shadow"
                        >
                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={20}
                                        className={`${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                    />
                                ))}
                            </div>
                            <p className="text-gray-700 italic mb-6">"{review.comment}"</p>
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-bold text-primary">{review.name}</span>
                                <span className="text-gray-500">{review.date}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
