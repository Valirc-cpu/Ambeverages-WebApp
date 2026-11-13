import React from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import MetaMaskLogo from '../Components/MetaMaskLogo';
import Button from '../Components/Button';
import { Coffee, ShoppingCart, LogOut, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminLayout({ children, title = 'Admin Panel' }) {
    const { auth, flash, url } = usePage().props;
    const user = auth?.user;
    const currentPath = window.location.pathname;

    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    return (
        <div className="min-h-screen bg-[#121416] text-[#F2F4F6] flex flex-col">
            {/* Topbar */}
            <header className="sticky top-0 z-40 bg-[#16181B]/95 backdrop-blur-md border-b border-[#262A30]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                        <Link href="/admin/orders">
                            <MetaMaskLogo />
                        </Link>
                        <span className="hidden md:inline-block px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-md bg-[#F6851B]/15 text-[#F6851B] border border-[#F6851B]/30">
                            Admin Workspace
                        </span>
                    </div>

                    {/* Nav tabs */}
                    <nav className="flex items-center gap-2">
                        <Link
                            href="/admin/orders"
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                                currentPath.includes('/admin/orders')
                                    ? 'bg-[#F6851B] text-white shadow-[0_4px_12px_rgba(246,133,27,0.3)]'
                                    : 'text-[#8F96A0] hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <ShoppingCart className="w-4 h-4" />
                            <span>Pesanan Masuk</span>
                        </Link>

                        <Link
                            href="/admin/drinks"
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                                currentPath.includes('/admin/drinks')
                                    ? 'bg-[#F6851B] text-white shadow-[0_4px_12px_rgba(246,133,27,0.3)]'
                                    : 'text-[#8F96A0] hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <Coffee className="w-4 h-4" />
                            <span>Kelola Minuman</span>
                        </Link>
                    </nav>

                    {/* Right utilities */}
                    <div className="flex items-center gap-3">
                        <Link
                            href="/"
                            target="_blank"
                            className="hidden sm:flex items-center gap-1.5 text-xs text-[#8F96A0] hover:text-[#F6851B] transition-colors"
                        >
                            <span>Lihat Katalog</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        <div className="h-6 w-px bg-[#2B2F36] hidden sm:block" />

                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex flex-col text-right">
                                <span className="text-xs font-semibold text-white">{user?.name || 'Administrator'}</span>
                                <span className="text-[11px] text-[#8F96A0]">{user?.email || 'admin@example.com'}</span>
                            </div>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={handleLogout}
                                title="Keluar"
                                className="text-xs text-[#8F96A0] hover:text-[#FF6B7A]"
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
                    <div className="mb-4 p-4 rounded-2xl bg-[#28A745]/15 border border-[#28A745]/40 text-[#48D168] flex items-center justify-between gap-3 animate-in fade-in duration-200">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 shrink-0" />
                            <span className="text-sm font-medium">{flash.success}</span>
                        </div>
                    </div>
                )}
                {flash?.error && (
                    <div className="mb-4 p-4 rounded-2xl bg-[#D73A49]/15 border border-[#D73A49]/40 text-[#FF6B7A] flex items-center justify-between gap-3 animate-in fade-in duration-200">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <span className="text-sm font-medium">{flash.error}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-12 flex-1">
                {children}
            </main>
        </div>
    );
}
