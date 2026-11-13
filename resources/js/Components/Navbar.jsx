import React from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import MetaMaskLogo from './MetaMaskLogo';
import Button from './Button';
import { ShoppingBag, ShieldCheck, LogOut, MessageCircle } from 'lucide-react';

export default function Navbar({ onOpenCart, cartItemCount = 0 }) {
    const { auth, whatsappNumber } = usePage().props;
    const user = auth?.user;

    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    return (
        <header className="sticky top-0 z-40 bg-[#121416]/90 backdrop-blur-md border-b border-[#25282D]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
                {/* Brand Logo */}
                <Link href="/" className="hover:opacity-95 transition-opacity">
                    <MetaMaskLogo />
                </Link>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    {/* Cart Trigger Button */}
                    <button
                        type="button"
                        onClick={onOpenCart}
                        className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#1C1E22] hover:bg-[#25282E] border border-[#2F343C] hover:border-[#F6851B]/50 transition-all text-white font-medium text-sm group shadow-sm"
                        aria-label="Keranjang Belanja"
                    >
                        <div className="relative">
                            <ShoppingBag className="w-5 h-5 text-[#F6851B] group-hover:scale-110 transition-transform" />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-2 -right-2.5 bg-[#F6851B] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse shadow-md">
                                    {cartItemCount}
                                </span>
                            )}
                        </div>
                        <span className="hidden sm:inline">Keranjang</span>
                        {cartItemCount > 0 && (
                            <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-[#F6851B]/20 text-[#F6851B]">
                                {cartItemCount} item
                            </span>
                        )}
                    </button>

                    {/* Admin Status / Auth links */}
                    {user ? (
                        <div className="flex items-center gap-2">
                            <Link href="/admin/orders">
                                <Button variant="secondary" size="sm" className="hidden sm:inline-flex">
                                    <ShieldCheck className="w-4 h-4 text-[#F6851B]" />
                                    <span>Panel Admin</span>
                                </Button>
                            </Link>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleLogout}
                                title="Keluar"
                                className="text-[#8F96A0] hover:text-[#FF6B7A]"
                            >
                                <LogOut className="w-4 h-4" />
                            </Button>
                        </div>
                    ) : (
                        <Link href="/login">
                            <Button variant="ghost" size="sm" className="text-xs text-[#8F96A0] hover:text-white">
                                <ShieldCheck className="w-4 h-4" />
                                <span className="hidden sm:inline">Admin Login</span>
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
