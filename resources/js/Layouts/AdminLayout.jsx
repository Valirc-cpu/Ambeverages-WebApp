import React from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import MetaMaskLogo from '../Components/MetaMaskLogo';
import Button from '../Components/Button';
import ThemeToggle from '../Components/ThemeToggle';
import { Coffee, ShoppingCart, LogOut, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminLayout({ children, title = 'Admin Panel' }) {
    const { auth, flash } = usePage().props;
    const user = auth?.user;
    const currentPath = window.location.pathname;

    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    return (
        <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#0E1013] text-[#121417] dark:text-[#F2F4F7] flex flex-col font-sans transition-colors">
            {/* Topbar */}
            <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#121417]/95 backdrop-blur-md border-b border-[#E5E8EC] dark:border-[#262A32]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                        <Link href="/admin/orders">
                            <MetaMaskLogo />
                        </Link>
                        <span className="hidden md:inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-[#121417] dark:bg-[#1E222A] text-white border border-transparent dark:border-[#353B47]">
                            Admin Workspace
                        </span>
                    </div>

                    {/* Nav tabs */}
                    <nav className="flex items-center gap-1.5 bg-[#ECEFF2] dark:bg-[#191C22] p-1.5 rounded-full border border-[#DCE0E5] dark:border-[#2C313B]">
                        <Link
                            href="/admin/orders"
                            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all ${
                                currentPath.includes('/admin/orders')
                                    ? 'bg-[#121417] dark:bg-[#FA4B00] text-white shadow-md'
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
                                    ? 'bg-[#121417] dark:bg-[#FA4B00] text-white shadow-md'
                                    : 'text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#121417] dark:hover:text-white'
                            }`}
                        >
                            <Coffee className="w-4 h-4" />
                            <span>Kelola Minuman</span>
                        </Link>
                    </nav>

                    {/* Right utilities */}
                    <div className="flex items-center gap-3">
                        <ThemeToggle />

                        <Link
                            href="/"
                            target="_blank"
                            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#FA4B00] transition-colors"
                        >
                            <span>Lihat Katalog</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        <div className="h-6 w-px bg-[#E5E8EC] dark:bg-[#282C34] hidden sm:block" />

                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex flex-col text-right">
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
                                <span className="hidden sm:inline">Keluar</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Flash Alerts */}
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6">
                {flash?.success && (
                    <div className="mb-4 p-4 rounded-2xl bg-[#E8F8EE] dark:bg-[#142B1C] border border-[#B9F24B] dark:border-[#279F41] text-[#145D25] dark:text-[#7AE595] flex items-center justify-between gap-3 animate-in fade-in duration-200">
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
