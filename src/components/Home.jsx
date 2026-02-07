import React from 'react';
import Navbar from './Navbar';
import ProductHero from './ProductHero';
import HeroCarousel from './HeroCarousel';
import MenuSection from './MenuSection';
import BlogsSection from './BlogsSection';
import RatingSection from './RatingSection';
import ContactSection from './ContactSection';
import Footer from './Footer';
import CartSidebar from './CartSidebar';

export default function Home({ cartItems, addToCart, removeFromCart, updateQuantity, isCartOpen, setIsCartOpen, cartCount }) {
    return (
        <>
            <Navbar
                cartCount={cartCount}
                toggleCart={() => setIsCartOpen(true)}
            />

            <main id="home">
                <ProductHero />
                <HeroCarousel />
                <MenuSection addToCart={addToCart} />
                <RatingSection />
                <BlogsSection />
                <ContactSection />
            </main>

            <Footer />

            <CartSidebar
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cartItems={cartItems}
                removeFromCart={removeFromCart}
                updateQuantity={updateQuantity}
            />
        </>
    );
}
