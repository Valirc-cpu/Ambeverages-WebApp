'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MetaMaskLogo from './MetaMaskLogo';
import ThemeToggle from './ThemeToggle';
import { ShoppingBag, ShieldCheck, LogOut, Menu, X, Coffee, Layers, Home, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ onOpenCart, cartItemCount = 0, user = null }) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Close mobile menu on page navigation or Escape key
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setIsMobileMenuOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleLogout = async (e) => {
        e.preventDefault();
        setIsMobileMenuOpen(false);
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = '/login';
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
                        <ShoppingBag className="w-4 h-4 text-[#FA4B00] group-hover:scale-110 transition-transform" />
                        <span className="hidden sm:inline">Keranjang</span>
                        {cartItemCount > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-[#FA4B00] text-white text-[11px] font-extrabold min-w-5 text-center shadow-xs">
                                {cartItemCount}
                            </span>
                        )}
                    </button>

                    {/* Desktop Admin Quick Link */}
                    {user ? (
                        <div className="hidden md:flex items-center gap-2 pl-1">
                            <Link
                                href="/admin/orders"
                                className="h-10 px-4 rounded-full bg-[#F2F4F7] dark:bg-[#1A1D24] text-[#121417] dark:text-white hover:bg-[#E5E8EC] dark:hover:bg-[#252932] transition-colors flex items-center gap-2 text-xs font-bold border border-[#DCE0E5] dark:border-[#2C313B]"
                            >
                                <ShieldCheck className="w-4 h-4 text-[#FA4B00]" />
                                <span>Panel Admin</span>
                            </Link>

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="h-10 w-10 rounded-full flex items-center justify-center text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#D73A49] hover:bg-[#F2F4F7] dark:hover:bg-[#1A1D24] transition-colors cursor-pointer"
                                title="Keluar"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="hidden md:flex items-center gap-1.5 h-10 px-4 rounded-full text-xs font-bold text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#121417] dark:hover:text-white hover:bg-[#F2F4F7] dark:hover:bg-[#1A1D24] border border-transparent hover:border-[#DCE0E5] dark:hover:border-[#2C313B] transition-all"
                        >
                            <ShieldCheck className="w-4 h-4 text-[#FA4B00]" />
                            <span>Masuk Admin</span>
                        </Link>
                    )}

                    {/* Mobile Hamburger Button */}
                    <button
                        type="button"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden h-10 w-10 rounded-full flex items-center justify-center bg-[#F2F4F7] dark:bg-[#1A1D24] text-[#121417] dark:text-white border border-[#DCE0E5] dark:border-[#2C313B] active:scale-95 transition-all cursor-pointer"
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
                            {/* Navigation Links */}
                            <div className="space-y-1.5">
                                <Link
                                    href="/"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center justify-between p-3 rounded-2xl bg-[#F7F8FA] dark:bg-[#1A1D24] hover:bg-[#EEF0F3] dark:hover:bg-[#20242D] text-[#121417] dark:text-white font-bold text-sm transition-colors"
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
                                    className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#F7F8FA] dark:bg-[#1A1D24] hover:bg-[#EEF0F3] dark:hover:bg-[#20242D] text-[#121417] dark:text-white font-bold text-sm transition-colors text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-[#E8F8EE] dark:bg-[#142B1C] text-[#1EBE5D] flex items-center justify-center">
                                            <ShoppingBag className="w-4 h-4" />
                                        </div>
                                        <span>Keranjang Pesanan</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {cartItemCount > 0 && (
                                            <span className="px-2 py-0.5 rounded-full bg-[#FA4B00] text-white text-xs font-extrabold">
                                                {cartItemCount}
                                            </span>
                                        )}
                                        <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
                                    </div>
                                </button>
                            </div>

                            {/* User Section in Mobile Menu */}
                            <div className="pt-3 border-t border-[#F0F2F5] dark:border-[#24272D]">
                                {user ? (
                                    <div className="space-y-2">
                                        <div className="p-3 rounded-2xl bg-[#F2F4F7] dark:bg-[#1A1D24] flex items-center justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-full bg-[#FA4B00] text-white flex items-center justify-center text-xs font-bold">
                                                    {user.name?.charAt(0) || 'A'}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-[#121417] dark:text-white leading-tight">
                                                        {user.name}
                                                    </span>
                                                    <span className="text-[10px] text-[#6B7280] dark:text-[#9CA3AF]">
                                                        {user.email}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="px-2 py-0.5 rounded-full bg-[#121417] dark:bg-[#252932] text-white text-[10px] font-bold">
                                                Admin
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 pt-1">
                                            <Link
                                                href="/admin/orders"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="p-2.5 rounded-xl bg-[#FFF3EB] dark:bg-[#2A180E] text-[#FA4B00] text-xs font-bold flex items-center justify-center gap-1.5"
                                            >
                                                <Layers className="w-3.5 h-3.5" />
                                                <span>Pesanan</span>
                                            </Link>
                                            <Link
                                                href="/admin/drinks"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="p-2.5 rounded-xl bg-[#F2F4F7] dark:bg-[#1E222A] text-[#121417] dark:text-white text-xs font-bold flex items-center justify-center gap-1.5"
                                            >
                                                <Coffee className="w-3.5 h-3.5 text-[#FA4B00]" />
                                                <span>Menu</span>
                                            </Link>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="w-full mt-2 p-2.5 rounded-xl border border-[#FEE2E2] dark:border-[#3D1E24] text-[#D73A49] hover:bg-[#FEE2E2]/30 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                                        >
                                            <LogOut className="w-3.5 h-3.5" />
                                            <span>Keluar dari Admin</span>
                                        </button>
                                    </div>
                                ) : (
                                    <Link
                                        href="/login"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="w-full p-3 rounded-2xl bg-[#121417] dark:bg-[#FA4B00] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-[0.98]"
                                    >
                                        <ShieldCheck className="w-4 h-4" />
                                        <span>Masuk sebagai Administrator</span>
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
