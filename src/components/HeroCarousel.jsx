import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCarousels } from '../hooks';

const FALLBACK_ADS = [
    {
        id: 1,
        title: "Sweet Honey Delight",
        description: "Experience the authentic taste of Cilembu.",
        backgroundColor: "bg-amber-100",
        image: "/new-product-bg.jpg"
    },
    {
        id: 2,
        title: "New Cheese Special",
        description: "Melty cheesy goodness meet sweet potato.",
        backgroundColor: "bg-yellow-100",
        image: "/new-product-bg.jpg"
    },
    {
        id: 3,
        title: "Family Party Pack",
        description: "Get 20% off for bundle purchase!",
        backgroundColor: "bg-orange-100",
        image: "/new-product-bg.jpg"
    }
];

export default function HeroCarousel() {
    const { data: carouselsData = [] } = useCarousels();
    const ads = carouselsData.length > 0 ? carouselsData : FALLBACK_ADS;
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % ads.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [ads.length]);

    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    const currentAd = ads[current] || FALLBACK_ADS[0];
    const bgColor = currentAd.backgroundColor || currentAd.color || 'bg-amber-100';

    return (
        <section className="relative w-full h-[500px] overflow-hidden bg-background">
            <AnimatePresence initial={false}>
                <motion.div
                    key={current}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 }
                    }}
                    className={`absolute w-full h-full flex items-center justify-center ${bgColor}`}
                >
                    <div className="container mx-auto px-6 grid md:grid-cols-2 gap-8 items-center h-full">
                        <div className="text-left space-y-4 p-6">
                            <motion.h1
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-5xl md:text-7xl font-bold text-primary drop-shadow-md"
                            >
                                {currentAd.title}
                            </motion.h1>
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-xl text-primary/80 font-medium"
                            >
                                {currentAd.description}
                            </motion.p>
                            <motion.button
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                whileHover={{ scale: 1.05 }}
                                className="bg-primary text-secondary px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                            >
                                Order Now
                            </motion.button>
                        </div>
                        <div className="relative h-64 md:h-96 w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-background transform rotate-2">
                            <img src={currentAd.image} alt={currentAd.title} className="w-full h-full object-cover" />
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            <button
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/50 rounded-full hover:bg-white text-primary z-10 transition-colors"
                onClick={() => setCurrent((prev) => (prev - 1 + ads.length) % ads.length)}
            >
                <ChevronLeft size={32} />
            </button>
            <button
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/50 rounded-full hover:bg-white text-primary z-10 transition-colors"
                onClick={() => setCurrent((prev) => (prev + 1) % ads.length)}
            >
                <ChevronRight size={32} />
            </button>
        </section>
    );
}
