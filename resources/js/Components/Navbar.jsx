import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import MetaMaskLogo from './MetaMaskLogo';
import ThemeToggle from './ThemeToggle';
import { ShoppingBag, ShieldCheck, LogOut, Menu, X, Coffee, Layers, Home, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ onOpenCart, cartItemCount = 0 }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Close mobile menu on page navigation or Escape key
    useEffect(() => {
        const removeListener = router.on('navigate', () => setIsMobileMenuOpen(false));
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setIsMobileMenuOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            removeListener();
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const handleLogout = (e) => {
        e.preventDefault();
        setIsMobileMenuOpen(false);
        router.post('/logout');
    };

    return (
        <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#121417]/95 backdrop-blur-md border-b border-[#E5E8EC] dark:border-[#262A32] transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3">
                {/* Brand Logo */}
                <Link href="/" className="hover:opacity-90 transition-opacity flex items-center shrink-0">
                    <MetaMaskLogo />
                </Link>

                {/* Right Actions */}
                <div className="flex items-center gap-2 sm:gap-2.5">
                    {/* Theme Toggle (Light / Dark) */}
                    <ThemeToggle />

                    {/* Cart Trigger Button - Always 1-Tap Accessible */}
                    <button
                        type="button"
                        onClick={onOpenCart}
                        className="relative h-10 sm:h-11 flex items-center gap-2 px-3.5 sm:px-5 rounded-full bg-[#121417] dark:bg-[#1E2229] hover:bg-[#2A2E35] dark:hover:bg-[#2B303A] text-white transition-all font-bold text-xs sm:text-sm shadow-xs border border-transparent dark:border-[#323844] active:scale-[0.98] group cursor-pointer"
                        aria-label="Keranjang Belanja"
                    >
                        <div className="relative">
                            <ShoppingBag className="w-4 h-4 text-[#FA4B00] group-hover:scale-110 transition-transform" />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-2.5 -right-3 bg-[#FA4B00] text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                                    {cartItemCount}
                                </span>
                            )}
                        </div>
                        <span className="hidden sm:inline">Keranjang</span>
                        {cartItemCount > 0 && (
                            <span className="hidden sm:inline-block text-xs font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">
                                {cartItemCount}
                            </span>
                        )}
                    </button>

                    {/* Desktop Admin Status / Auth links */}
                    <div className="hidden md:flex items-center gap-2">
                        {user ? (
                            <>
                                <Link href="/admin/orders" className="flex items-center">
                                    <button
                                        type="button"
                                        className="h-10 sm:h-11 px-4 sm:px-5 rounded-full inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#121417] dark:text-white bg-white dark:bg-[#1A1D23] hover:bg-gray-50 dark:hover:bg-[#252932] border border-[#DCE0E5] dark:border-[#2C313A] shadow-xs active:scale-[0.98] transition-all cursor-pointer"
                                    >
                                        <ShieldCheck className="w-4 h-4 text-[#FA4B00]" />
                                        <span>Panel Admin</span>
                                    </button>
                                </Link>
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    title="Keluar"
                                    className="h-10 sm:h-11 w-10 sm:w-11 rounded-full flex items-center justify-center text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#D73A49] hover:bg-[#FEE2E2] dark:hover:bg-[#2A1517] transition-all cursor-pointer"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </>
                        ) : (
                            <Link href="/login" className="flex items-center">
                                <button
                                    type="button"
                                    className="h-10 sm:h-11 px-4 sm:px-5 rounded-full inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#4B5563] dark:text-[#9CA3AF] hover:text-[#121417] dark:hover:text-white bg-[#ECEFF2]/80 dark:bg-[#1A1D23] hover:bg-[#E2E6EB] dark:hover:bg-[#252932] border border-[#DCE0E5] dark:border-[#2C313A] shadow-xs active:scale-[0.98] transition-all cursor-pointer"
                                >
                                    <ShieldCheck className="w-4 h-4 text-[#FA4B00]" />
                                    <span>Admin</span>
                                </button>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Hamburger Button */}
                    <button
                        type="button"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden h-10 w-10 rounded-full flex items-center justify-center bg-[#F2F4F7] dark:bg-[#1A1D24] text-[#121417] dark:text-white border border-[#DCE0E5] dark:border-[#2A2E36] active:scale-95 transition-all cursor-pointer"
                        aria-label={isMobileMenuOpen ? 'Tutup Menu' : 'Buka Menu'}
                        aria-expanded={isMobileMenuOpen}
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-5 h-5 text-[#FA4B00]" />
                        ) : (
                            <Menu className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Drawer Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Overlay backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 top-20 bg-black/40 backdrop-blur-xs z-40 md:hidden"
                        />

                        {/* Menu Panel */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="relative z-50 md:hidden border-b border-[#E5E8EC] dark:border-[#262A32] bg-white dark:bg-[#15171C] px-5 py-6 shadow-xl space-y-4"
                        >
                            {/* Nav Links */}
                            <div className="space-y-1.5">
                                <Link
                                    href="/"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center justify-between p-3 rounded-2xl hover:bg-[#F2F4F7] dark:hover:bg-[#1E222A] text-[#121417] dark:text-white font-bold text-sm transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-[#FFF3EB] dark:bg-[#2A180E] text-[#FA4B00] flex items-center justify-center">
                                            <Home className="w-4 h-4" />
                                        </div>
                                        <span>Katalog Minuman</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
                                </Link>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        onOpenCart();
                                    }}
                                    className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-[#F2F4F7] dark:hover:bg-[#1E222A] text-[#121417] dark:text-white font-bold text-sm transition-colors text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-[#FFF3EB] dark:bg-[#2A180E] text-[#FA4B00] flex items-center justify-center">
                                            <ShoppingBag className="w-4 h-4" />
                                        </div>
                                        <span>Keranjang Belanja</span>
                                    </div>
                                    <span className="text-xs px-2.5 py-1 rounded-full bg-[#FA4B00] text-white font-bold">
                                        {cartItemCount} item
                                    </span>
                                </button>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-[#F0F2F5] dark:border-[#262A32] pt-4">
                                {user ? (
                                    <div className="space-y-2">
                                        <div className="px-3 py-2 rounded-xl bg-[#F7F8FA] dark:bg-[#1A1D24] text-xs">
                                            <span className="text-[#6B7280] dark:text-[#9CA3AF] block text-[10px] uppercase font-bold tracking-wider">
                                                Login Sebagai
                                            </span>
                                            <span className="font-bold text-[#121417] dark:text-white block truncate">
                                                {user.name} ({user.email})
                                            </span>
                                        </div>

                                        <Link
                                            href="/admin/orders"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center justify-between p-3 rounded-2xl hover:bg-[#F2F4F7] dark:hover:bg-[#1E222A] text-[#121417] dark:text-white font-bold text-sm transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-[#E8F8EE] dark:bg-[#142B1C] text-[#15803D] dark:text-[#86EFAC] flex items-center justify-center">
                                                    <ShieldCheck className="w-4 h-4" />
                                                </div>
                                                <span>Pesanan Masuk</span>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
                                        </Link>

                                        <Link
                                            href="/admin/drinks"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center justify-between p-3 rounded-2xl hover:bg-[#F2F4F7] dark:hover:bg-[#1E222A] text-[#121417] dark:text-white font-bold text-sm transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-[#FFF3EB] dark:bg-[#2A180E] text-[#FA4B00] flex items-center justify-center">
                                                    <Coffee className="w-4 h-4" />
                                                </div>
                                                <span>Kelola Menu Minuman</span>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="w-full flex items-center justify-between p-3 rounded-2xl text-[#D73A49] hover:bg-[#FEE2E2]/60 dark:hover:bg-[#2A1517] font-bold text-sm transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-[#FEE2E2] dark:bg-[#2A1517] text-[#D73A49] flex items-center justify-center">
                                                    <LogOut className="w-4 h-4" />
                                                </div>
                                                <span>Keluar dari Akun</span>
                                            </div>
                                        </button>
                                    </div>
                                ) : (
                                    <Link
                                        href="/login"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center justify-between p-3 rounded-2xl hover:bg-[#F2F4F7] dark:hover:bg-[#1E222A] text-[#121417] dark:text-white font-bold text-sm transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-[#ECEFF2] dark:bg-[#20242D] text-[#FA4B00] flex items-center justify-center">
                                                <ShieldCheck className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <span>Login Admin</span>
                                                <span className="block text-[11px] font-normal text-[#6B7280] dark:text-[#9CA3AF]">
                                                    Kelola menu & konfirmasi pesanan
                                                </span>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
                                    </Link>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
}
