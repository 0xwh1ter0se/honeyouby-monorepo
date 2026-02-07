import React from 'react';
import { Instagram, Heart } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-primary text-background py-10 border-t-8 border-secondary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="mb-6">
                    <h2 className="text-3xl font-bold text-secondary mb-2">HoneyOuby</h2>
                    <p className="text-background/80 font-medium">Sweetness in every bite!</p>
                </div>

                <div className="flex justify-center gap-8 mb-8">
                    <a href="https://www.instagram.com/dezaamrfai" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transform hover:scale-125 transition-all flex flex-col items-center gap-2">
                        <div className="bg-white/10 p-3 rounded-full backdrop-blur-sm">
                            <Instagram size={24} />
                        </div>
                        <span className="text-xs font-medium tracking-wider">@dezaamrfai</span>
                    </a>
                    <a href="https://www.tiktok.com/@honeyoubyreal" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transform hover:scale-125 transition-all flex flex-col items-center gap-2">
                        <div className="bg-white/10 p-3 rounded-full backdrop-blur-sm">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                            </svg>
                        </div>
                        <span className="text-xs font-medium tracking-wider">@honeyoubyreal</span>
                    </a>
                </div>

                <div className="flex flex-col items-center gap-2">
                    <div className="text-sm font-medium flex items-center justify-center gap-1">
                        &copy; {new Date().getFullYear()} HoneyOuby. Made with <Heart size={16} className="text-red-400 fill-current" /> by Deza Amru Rifai.
                    </div>
                    <p className="text-xs text-background/80 font-medium">Thank you God and Dad for the idea</p>
                </div>
            </div>
        </footer>
    );
}
