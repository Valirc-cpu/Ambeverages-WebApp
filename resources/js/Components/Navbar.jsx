import React from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import MetaMaskLogo from './MetaMaskLogo';
import Button from './Button';
import { ShoppingBag, ShieldCheck, LogOut } from 'lucide-react';

export default function Navbar({ onOpenCart, cartItemCount = 0 }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    return (
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#E5E8EC] transition-all">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
                {/* Brand Logo */}
                <Link href="/" className="hover:opacity-90 transition-opacity flex items-center">
                    <MetaMaskLogo />
                </Link>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    {/* Cart Trigger Button */}
                    <button
                        type="button"
                        onClick={onOpenCart}
                        className="relative flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#121417] hover:bg-[#2A2E35] text-white transition-all font-bold text-sm shadow-[0_4px_14px_rgba(0,0,0,0.12)] active:scale-[0.98] group"
                        aria-label="Keranjang Belanja"
                    >
                        <div className="relative">
                            <ShoppingBag className="w-4 h-4 text-[#FA4B00] group-hover:scale-110 transition-transform" />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-2.5 -right-3 bg-[#B9F24B] text-[#121417] text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                                    {cartItemCount}
                                </span>
                            )}
                        </div>
                        <span className="hidden sm:inline">Keranjang</span>
                        {cartItemCount > 0 && (
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">
                                {cartItemCount}
                            </span>
                        )}
                    </button>

                    {/* Admin Status / Auth links */}
                    {user ? (
                        <div className="flex items-center gap-2">
                            <Link href="/admin/orders">
                                <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                                    <ShieldCheck className="w-4 h-4 text-[#FA4B00]" />
                                    <span>Panel Admin</span>
                                </Button>
                            </Link>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleLogout}
                                title="Keluar"
                                className="text-[#6B7280] hover:text-[#D73A49]"
                            >
                                <LogOut className="w-4 h-4" />
                            </Button>
                        </div>
                    ) : (
                        <Link href="/login">
                            <Button variant="ghost" size="sm" className="text-xs text-[#6B7280] hover:text-[#121417] font-semibold">
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
