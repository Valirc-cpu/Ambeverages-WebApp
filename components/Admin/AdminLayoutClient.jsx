'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import MetaMaskLogo from '../MetaMaskLogo';
import Button from '../Button';
import ThemeToggle from '../ThemeToggle';
import { Coffee, ShoppingCart, LogOut, ExternalLink, Menu, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayoutClient({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#0E1013] text-[#121417] dark:text-[#F2F4F7] flex flex-col font-sans transition-colors">
            {/* Topbar */}
            <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#121417]/95 backdrop-blur-md border-b border-[#E5E8EC] dark:border-[#262A32]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 sm:gap-6">
                        <Link href="/admin/orders" className="shrink-0">
                            <MetaMaskLogo />
                        </Link>
                        <span className="hidden lg:inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-[#121417] dark:bg-[#1E222A] text-white border border-transparent dark:border-[#353B47]">
                            Admin Workspace
                        </span>
                    </div>

                    {/* Desktop Nav tabs */}
                    <nav className="hidden md:flex items-center gap-1.5 bg-[#ECEFF2] dark:bg-[#191C22] p-1.5 rounded-full border border-[#DCE0E5] dark:border-[#2C313B]">
                        <Link
                            href="/admin/orders"
                            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all ${
                                pathname.includes('/admin/orders')
                                    ? 'bg-[#121417] dark:bg-[#FA4B00] text-white shadow-xs'
                                    : 'text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#121417] dark:hover:text-white'
                            }`}
                        >
                            <ShoppingCart className="w-4 h-4" />
                            <span>Pesanan Masuk</span>
                        </Link>

                        <Link
                            href="/admin/drinks"
                            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all ${
                                pathname.includes('/admin/drinks')
                                    ? 'bg-[#121417] dark:bg-[#FA4B00] text-white shadow-xs'
                                    : 'text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#121417] dark:hover:text-white'
                            }`}
                        >
                            <Coffee className="w-4 h-4" />
                            <span>Kelola Minuman</span>
                        </Link>
                    </nav>

                    {/* Right utilities */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <ThemeToggle />

                        <Link
                            href="/"
                            target="_blank"
                            className="hidden md:flex items-center gap-1.5 text-xs font-bold text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#FA4B00] transition-colors"
                        >
                            <span>Lihat Katalog</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        <div className="h-6 w-px bg-[#E5E8EC] dark:bg-[#282C34] hidden md:block" />

                        {/* Desktop Logout */}
                        <div className="hidden md:flex items-center gap-3">
                            <div className="flex flex-col text-right">
                                <span className="text-xs font-bold text-[#121417] dark:text-white">Administrator</span>
                                <span className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">Ambeverages</span>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleLogout}
                                title="Keluar"
                                className="text-xs text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#D73A49] dark:bg-[#191C22] dark:border-[#2C313B]"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                                <span>Keluar</span>
                            </Button>
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
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="fixed inset-0 top-20 bg-black/40 backdrop-blur-xs z-40 md:hidden"
                            />

                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2, ease: 'easeOut' }}
                                className="relative z-50 md:hidden border-b border-[#E5E8EC] dark:border-[#262A32] bg-white dark:bg-[#15171C] px-5 py-6 shadow-xl space-y-4"
                            >
                                <div className="space-y-1.5">
                                    <Link
                                        href="/admin/orders"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center justify-between p-3 rounded-2xl font-bold text-sm transition-colors ${
                                            pathname.includes('/admin/orders')
                                                ? 'bg-[#121417] dark:bg-[#FA4B00] text-white'
                                                : 'hover:bg-[#F2F4F7] dark:hover:bg-[#1E222A] text-[#121417] dark:text-white'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                                                <ShoppingCart className="w-4 h-4" />
                                            </div>
                                            <span>Pesanan Masuk</span>
                                        </div>
                                        <ChevronRight className="w-4 h-4 opacity-70" />
                                    </Link>

                                    <Link
                                        href="/admin/drinks"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center justify-between p-3 rounded-2xl font-bold text-sm transition-colors ${
                                            pathname.includes('/admin/drinks')
                                                ? 'bg-[#121417] dark:bg-[#FA4B00] text-white'
                                                : 'hover:bg-[#F2F4F7] dark:hover:bg-[#1E222A] text-[#121417] dark:text-white'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                                                <Coffee className="w-4 h-4" />
                                            </div>
                                            <span>Kelola Minuman</span>
                                        </div>
                                        <ChevronRight className="w-4 h-4 opacity-70" />
                                    </Link>
                                </div>

                                <div className="pt-3 border-t border-[#F0F2F5] dark:border-[#24272D] space-y-2">
                                    <Link
                                        href="/"
                                        target="_blank"
                                        className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-[#F2F4F7] dark:bg-[#1A1D24] text-[#121417] dark:text-white text-xs font-bold hover:bg-[#E5E8EC] dark:hover:bg-[#252932] transition-colors"
                                    >
                                        <ExternalLink className="w-4 h-4 text-[#FA4B00]" />
                                        <span>Buka Toko / Katalog Pelanggan</span>
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="w-full p-3 rounded-2xl border border-[#FEE2E2] dark:border-[#3D1E24] text-[#D73A49] hover:bg-[#FEE2E2]/30 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Keluar dari Admin Workspace</span>
                                    </button>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </header>

            {/* Page Content */}
            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {children}
            </main>
        </div>
    );
}
