import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import MetaMaskLogo from '../Components/MetaMaskLogo';
import Button from '../Components/Button';
import ThemeToggle from '../Components/ThemeToggle';
import { Coffee, ShoppingCart, LogOut, ExternalLink, CheckCircle2, AlertCircle, Menu, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout({ children, title = 'Admin Panel' }) {
    const { auth, flash } = usePage().props;
    const user = auth?.user;
    const currentPath = window.location.pathname;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Auto-close on page transition or Escape key
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
                                currentPath.includes('/admin/orders')
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
                                currentPath.includes('/admin/drinks')
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

                        {/* Desktop User Info & Logout */}
                        <div className="hidden md:flex items-center gap-3">
                            <div className="flex flex-col text-right">
                                <span className="text-xs font-bold text-[#121417] dark:text-white">{user?.name || 'Administrator'}</span>
                                <span className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">{user?.email || 'admin@example.com'}</span>
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
                                {/* Admin Navigation Links */}
                                <div className="space-y-1.5">
                                    <Link
                                        href="/admin/orders"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center justify-between p-3 rounded-2xl font-bold text-sm transition-colors ${
                                            currentPath.includes('/admin/orders')
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
                                            currentPath.includes('/admin/drinks')
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

                                    <Link
                                        href="/"
                                        target="_blank"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center justify-between p-3 rounded-2xl hover:bg-[#F2F4F7] dark:hover:bg-[#1E222A] text-[#121417] dark:text-white font-bold text-sm transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-[#FFF3EB] dark:bg-[#2A180E] text-[#FA4B00] flex items-center justify-center">
                                                <ExternalLink className="w-4 h-4" />
                                            </div>
                                            <span>Buka Katalog Publik</span>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
                                    </Link>
                                </div>

                                {/* Divider & User Section */}
                                <div className="border-t border-[#F0F2F5] dark:border-[#262A32] pt-4 space-y-3">
                                    <div className="px-3 py-2.5 rounded-xl bg-[#F7F8FA] dark:bg-[#1A1D24] text-xs">
                                        <span className="text-[#6B7280] dark:text-[#9CA3AF] block text-[10px] uppercase font-bold tracking-wider">
                                            Akun Administrator
                                        </span>
                                        <span className="font-bold text-[#121417] dark:text-white block mt-0.5 truncate">
                                            {user?.name || 'Administrator'}
                                        </span>
                                        <span className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF] block truncate">
                                            {user?.email || 'admin@example.com'}
                                        </span>
                                    </div>

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
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </header>

            {/* Flash Alerts */}
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6">
                {flash?.success && (
                    <div className="mb-4 p-4 rounded-2xl bg-[#E8F8EE] dark:bg-[#142B1C] border border-[#86EFAC] dark:border-[#279F41] text-[#145D25] dark:text-[#7AE595] flex items-center justify-between gap-3 animate-in fade-in duration-200">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 shrink-0 text-[#279F41]" />
                            <span className="text-sm font-bold">{flash.success}</span>
                        </div>
                    </div>
                )}
                {flash?.error && (
                    <div className="mb-4 p-4 rounded-2xl bg-[#FEE2E2] dark:bg-[#2E1417] border border-[#FECACA] dark:border-[#CA3542] text-[#B91C1C] dark:text-[#FF8A96] flex items-center justify-between gap-3 animate-in fade-in duration-200">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <span className="text-sm font-bold">{flash.error}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-14 flex-1">
                {children}
            </main>
        </div>
    );
}
