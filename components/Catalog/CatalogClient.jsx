'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../Navbar';
import HeroSection from './HeroSection';
import DrinkCard from './DrinkCard';
import DrinkParallaxDeck from './DrinkParallaxDeck';
import CartModal from './CartModal';
import OrderSuccessModal from './OrderSuccessModal';
import ParallaxVectors from '../ParallaxVectors';
import Button from '../Button';
import { Coffee, PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CatalogClient({ initialDrinks = [], initialIsOpen = true }) {
    const [drinks, setDrinks] = useState(initialDrinks);
    const [isOpen, setIsOpen] = useState(initialIsOpen);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [successOrder, setSuccessOrder] = useState(null);

    // Keep drinks and store open state in sync with server data
    useEffect(() => {
        setDrinks(initialDrinks);
    }, [initialDrinks]);

    useEffect(() => {
        setIsOpen(initialIsOpen);
    }, [initialIsOpen]);

    // Cart state persisted in localStorage
    const [cart, setCart] = useState([]);
    useEffect(() => {
        try {
            const saved = localStorage.getItem('ambeverages_cart');
            if (saved) setCart(JSON.parse(saved));
        } catch {}
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem('ambeverages_cart', JSON.stringify(cart));
        } catch {}
    }, [cart]);

    // Checkout form state
    const [checkoutForm, setCheckoutForm] = useState({
        customer_name: '',
        customer_phone: '',
        notes: '',
    });
    const [formErrors, setFormErrors] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);

    const handleAddToCart = (drink) => {
        if (!isOpen) {
            alert('Maaf, katalog minuman Ambeverages saat ini sedang ditutup.');
            return;
        }
        if (drink.stock <= 0) return;

        setCart((prev) => {
            const idx = prev.findIndex((i) => i.id === drink.id);
            if (idx > -1) {
                const currentQty = prev[idx].quantity;
                if (currentQty >= drink.stock) {
                    alert(`Maaf, stok ${drink.name} yang tersedia hanya ${drink.stock} porsi.`);
                    return prev;
                }
                const updated = [...prev];
                updated[idx] = { ...updated[idx], quantity: currentQty + 1 };
                return updated;
            } else {
                return [
                    ...prev,
                    {
                        id: drink.id,
                        name: drink.name,
                        price: drink.price,
                        formatted_price: drink.formatted_price,
                        image_url: drink.image_url,
                        stock: drink.stock,
                        quantity: 1,
                    },
                ];
            }
        });
        setIsCartOpen(true);
    };

    const handleUpdateQuantity = (drinkId, delta) => {
        setCart((prev) =>
            prev
                .map((item) => {
                    if (item.id === drinkId) {
                        const newQty = item.quantity + delta;
                        if (newQty > item.stock) {
                            alert(`Jumlah pesanan tidak dapat melebihi stok yang ada (${item.stock} porsi).`);
                            return item;
                        }
                        return newQty > 0 ? { ...item, quantity: newQty } : null;
                    }
                    return item;
                })
                .filter(Boolean)
        );
    };

    const handleRemoveFromCart = (drinkId) => {
        setCart((prev) => prev.filter((item) => item.id !== drinkId));
    };

    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const handleCheckoutSubmit = async (e) => {
        e.preventDefault();
        if (!isOpen) {
            alert('Maaf, katalog minuman Ambeverages saat ini sedang ditutup dan tidak menerima pesanan.');
            return;
        }
        const errors = {};
        if (!checkoutForm.customer_name.trim()) errors.customer_name = 'Nama pemesan wajib diisi.';
        if (!checkoutForm.customer_phone.trim()) errors.customer_phone = 'Nomor WhatsApp aktif wajib diisi.';
        if (cart.length === 0) errors.cart = 'Keranjang Anda masih kosong.';

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setIsProcessing(true);
        setFormErrors({});

        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customer_name: checkoutForm.customer_name,
                    customer_phone: checkoutForm.customer_phone,
                    notes: checkoutForm.notes,
                    items: cart.map((i) => ({ drink_id: i.id, quantity: i.quantity })),
                }),
            });

            const result = await res.json();

            if (!res.ok) {
                alert(result.error || 'Terjadi kesalahan saat memproses pesanan.');
                setIsProcessing(false);
                return;
            }

            // Success: clear cart & show modal / redirect to WhatsApp
            setSuccessOrder(result.order);
            setCart([]);
            setIsCartOpen(false);
            setCheckoutForm({ customer_name: '', customer_phone: '', notes: '' });

            if (result.order?.whatsapp_url) {
                window.location.href = result.order.whatsapp_url;
            }
        } catch (err) {
            console.error('Checkout error:', err);
            alert('Gagal menghubungi server. Silakan periksa koneksi internet Anda.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-[#F7F8FA] dark:bg-[#0E1013] text-[#121417] dark:text-[#F2F4F7] flex flex-col font-sans selection:bg-[#FA4B00] selection:text-white transition-colors overflow-x-hidden">
            {/* Pop-art Parallax Vector Background */}
            <ParallaxVectors />

            {/* Sticky Navigation Bar */}
            <Navbar onOpenCart={() => setIsCartOpen(true)} cartItemCount={cartCount} />

            {/* Hero Section */}
            <HeroSection />

            {/* Main Catalog Menu */}
            <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full z-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#121417] dark:text-white flex items-center gap-2.5">
                            <Coffee className="w-6 h-6 text-[#FA4B00]" />
                            <span>Koleksi Minuman</span>
                        </h2>
                        <p className="text-xs sm:text-sm text-[#6B7280] dark:text-[#9CA3AF] mt-1 font-medium">
                            {isOpen
                                ? 'Dipilih segar, diracik dengan takaran presisi, dan siap dinikmati kapan saja.'
                                : 'Katalog minuman saat ini sedang ditutup oleh pihak kedai.'}
                        </p>
                    </div>
                </div>

                {!isOpen ? (
                    <div className="text-center py-16 sm:py-24 px-6 bg-white dark:bg-[#15171C] rounded-[32px] border border-[#E5E8EC] dark:border-[#262A32] shadow-xs max-w-xl mx-auto transition-colors">
                        <div className="w-16 h-16 rounded-2xl bg-[#FFF5F5] dark:bg-[#2D1518] text-[#D73A49] dark:text-[#F85149] flex items-center justify-center mx-auto mb-4 border border-[#D73A49]/20">
                            <Coffee className="w-8 h-8 opacity-70" />
                        </div>
                        <h3 className="text-xl font-extrabold text-[#121417] dark:text-white">
                            Katalog Minuman Sedang Ditutup
                        </h3>
                        <p className="text-xs sm:text-sm text-[#6B7280] dark:text-[#9CA3AF] mt-2 leading-relaxed max-w-md mx-auto">
                            Mohon maaf, saat ini katalog minuman Ambeverages sedang ditutup dan belum menerima pesanan baru. Silakan kembali lagi nanti saat kedai telah dibuka kembali!
                        </p>
                    </div>
                ) : drinks.length === 0 ? (
                    <div className="text-center py-20 px-6 bg-white dark:bg-[#15171C] rounded-[32px] border border-[#E5E8EC] dark:border-[#262A32] shadow-xs max-w-xl mx-auto transition-colors">
                        <div className="w-16 h-16 rounded-2xl bg-[#FFF3EB] dark:bg-[#2A180E] text-[#FA4B00] flex items-center justify-center mx-auto mb-4 border border-[#FA4B00]/20">
                            <Coffee className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-extrabold text-[#121417] dark:text-white">Ambeverages Station Sedang Standby</h3>
                        <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-1.5 leading-relaxed max-w-sm mx-auto">
                            Belum ada menu minuman yang ditambahkan. Masuk ke Panel Admin untuk mulai menginput data minuman pertamamu!
                        </p>
                        <div className="mt-6">
                            <Link href="/login">
                                <Button variant="orange" size="md">
                                    <PlusCircle className="w-4 h-4" />
                                    <span>Buka Admin & Tambah Menu</span>
                                </Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <DrinkParallaxDeck
                        drinks={drinks}
                        onAddToCart={handleAddToCart}
                    />
                )}
            </main>

            {/* Footer */}
            <footer className="relative bg-white dark:bg-[#121417] border-t border-[#E5E8EC] dark:border-[#24272D] py-12 transition-colors z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                    <div className="flex items-center gap-3">
                        <span className="font-extrabold text-sm text-[#121417] dark:text-white tracking-tight">Ambeverages.</span>
                        <span className="text-[#DCE0E5] dark:text-[#282C34]">|</span>
                        <span>I Am Beverages. All rights reserved.</span>
                    </div>
                    <div className="flex items-center gap-6 font-semibold">
                        <span>Pesan WhatsApp Otomatis</span>
                        <span>Stok Realtime</span>
                        <span>Bahan Pilihan</span>
                    </div>
                </div>
            </footer>

            {/* Cart & Checkout Modal */}
            <CartModal
                isOpen={isCartOpen}
                isStoreOpen={isOpen}
                onClose={() => setIsCartOpen(false)}
                cart={cart}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveFromCart={handleRemoveFromCart}
                cartTotal={cartTotal}
                checkoutForm={{
                    data: checkoutForm,
                    setData: (key, val) => setCheckoutForm((prev) => ({ ...prev, [key]: val })),
                    processing: isProcessing,
                    errors: formErrors,
                }}
                onCheckout={handleCheckoutSubmit}
            />

            {/* Order Success Modal */}
            <OrderSuccessModal
                order={successOrder}
                onClose={() => setSuccessOrder(null)}
            />
        </div>
    );
}
