import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export default function ProductHero() {
    return (
        <section className="relative w-full h-[600px] overflow-hidden bg-background">
            {/* Background Image */}
            <div
                className="absolute inset-0 w-full h-full bg-cover bg-center z-0"
                style={{ backgroundImage: "url('/new-product-bg.jpg')" }}
            >
                <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10 h-full flex items-center">
                <div className="grid md:grid-cols-2 gap-8 items-center w-full">
                    {/* Text Content */}
                    <div className="text-left space-y-6">
                        <motion.h1
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.6 }}
                            className="text-6xl md:text-8xl font-black text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] tracking-wide"
                        >
                            Honey<span className="text-secondary text-yellow-400">Ouby!</span>
                        </motion.h1>

                        <motion.p
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-2xl md:text-3xl font-medium text-white/95 leading-relaxed drop-shadow-md max-w-xl"
                        >
                            Nikmati kehangatan Ubi Cilembu yang <span className="font-bold text-yellow-300">sehat</span>, <span className="font-bold text-orange-300">hangat</span>, <span className="font-bold text-yellow-300">manis</span>, dan <span className="font-bold text-white">kekinian!</span>
                        </motion.p>

                        <motion.button
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-secondary text-primary px-8 py-4 rounded-full font-bold text-xl shadow-xl hover:bg-yellow-400 transition-colors mt-4"
                            onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            Cobain Sekarang
                        </motion.button>
                    </div>

                    {/* Mascot Image */}
                    <div className="hidden md:flex justify-end items-center h-full relative">
                        {/* Glow/Rays Effect Background */}
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 0.8, 0.5],
                                rotate: [0, 360]
                            }}
                            transition={{
                                duration: 10,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            className="absolute right-10 w-[500px] h-[500px] bg-gradient-to-r from-yellow-400/30 to-orange-500/30 rounded-full blur-3xl -z-10"
                        />

                        <motion.img
                            initial={{ y: 50, opacity: 0, rotate: 10 }}
                            animate={{
                                y: [0, -20, 0],
                                opacity: 1,
                                rotate: 0
                            }}
                            transition={{
                                y: {
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                },
                                default: {
                                    type: "spring",
                                    stiffness: 100,
                                    damping: 15,
                                    delay: 0.3
                                }
                            }}
                            src="/mascot.png"
                            alt="HoneyOuby Mascot"
                            className="w-auto h-[450px] object-contain drop-shadow-[0_0_15px_rgba(255,215,0,0.6)] filter brightness-110"
                            style={{ filter: "drop-shadow(0 0 20px rgba(255, 215, 0, 0.5)) drop-shadow(0 0 40px rgba(255, 215, 0, 0.3))" }}
                        />

                        {/* Rating Badge */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.8, type: "spring" }}
                            className="absolute bottom-10 right-0 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 flex flex-col items-center gap-1"
                        >
                            <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <span className="font-bold text-primary text-lg">Rate 4.6</span>
                        </motion.div>
                    </div>
                </div>

                {/* Supported By Section - Bottom Left */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="absolute bottom-6 left-6 md:left-20 z-20"
                >
                    <p className="text-white/80 text-sm font-semibold mb-2">Supported by:</p>
                    <div className="flex flex-wrap gap-3">
                        <span className="bg-green-600/90 text-white px-3 py-1 rounded-md text-xs font-bold shadow-lg backdrop-blur-sm border border-white/20">GoFood</span>
                        <span className="bg-green-500/90 text-white px-3 py-1 rounded-md text-xs font-bold shadow-lg backdrop-blur-sm border border-white/20">GrabFood</span>
                        <span className="bg-orange-500/90 text-white px-3 py-1 rounded-md text-xs font-bold shadow-lg backdrop-blur-sm border border-white/20">ShopeeFood</span>
                        <span className="bg-primary/90 text-secondary px-3 py-1 rounded-md text-xs font-bold shadow-lg backdrop-blur-sm border border-white/20">HO! Delivery</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
