import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, Phone, Mail } from 'lucide-react';

export default function ContactSection() {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const text = `Name: ${name}%0AMessage: ${message}`;
        window.open(`https://wa.me/6281774159652?text=${text}`, '_blank');
    };

    return (
        <section id="contact" className="py-20 bg-yellow-50 relative overflow-hidden">
            {/* Decorative blob */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-primary mb-4">Contact Us</h2>
                    <p className="text-gray-600">Have a question or want to order in bulk? Reach out!</p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-8"
                    >
                        <a
                            href="https://www.google.com/maps/search/?api=1&query=JL.+Kebagusan,+Pasar+Minggu,+Jakarta+Selatan,+DKI+Jakarta,+Indonesia+12520"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-start gap-4 group cursor-pointer"
                        >
                            <div className="bg-white p-3 rounded-full shadow-md text-secondary group-hover:scale-110 transition-transform">
                                <MapPin size={24} className="text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-primary group-hover:text-secondary transition-colors">Visit Us</h3>
                                <p className="text-gray-600">JL. Kebagusan, Pasar Minggu, Jakarta Selatan, DKI Jakarta, Indonesia 12520</p>
                            </div>
                        </a>

                        <a
                            href="https://wa.me/6281774159652"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-start gap-4 group cursor-pointer"
                        >
                            <div className="bg-white p-3 rounded-full shadow-md text-secondary group-hover:scale-110 transition-transform">
                                <Phone size={24} className="text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-primary group-hover:text-secondary transition-colors">Call/WA Us</h3>
                                <p className="text-gray-600">+62 817-7415-9652</p>
                            </div>
                        </a>

                        <a
                            href="mailto:honeyouby@gmail.com"
                            className="flex items-start gap-4 group cursor-pointer"
                        >
                            <div className="bg-white p-3 rounded-full shadow-md text-secondary group-hover:scale-110 transition-transform">
                                <Mail size={24} className="text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-primary group-hover:text-secondary transition-colors">Email</h3>
                                <p className="text-gray-600">honeyouby@gmail.com</p>
                            </div>
                        </a>
                    </motion.div>

                    <motion.form
                        initial={{ x: 50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        onSubmit={handleSubmit}
                        className="bg-white p-8 rounded-2xl shadow-xl border border-secondary/20"
                    >
                        <div className="space-y-6">
                            <div>
                                <label className="block text-primary font-bold mb-2">Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-secondary focus:ring-2 focus:ring-secondary/50 outline-none transition-all"
                                    placeholder="Your Name"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-primary font-bold mb-2">Message</label>
                                <textarea
                                    rows="4"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-secondary focus:ring-2 focus:ring-secondary/50 outline-none transition-all"
                                    placeholder="Tell us what you crave..."
                                    required
                                ></textarea>
                            </div>
                            <button className="w-full bg-primary text-secondary font-bold py-4 rounded-lg shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all flex justify-center items-center gap-2">
                                Send to WhatsApp <Send size={20} />
                            </button>
                        </div>
                    </motion.form>
                </div>
            </div>
        </section>
    );
}
