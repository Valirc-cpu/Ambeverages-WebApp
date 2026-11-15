'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MetaMaskLogo from '@/components/MetaMaskLogo';
import Button from '@/components/Button';
import ThemeToggle from '@/components/ThemeToggle';
import { Lock, Mail, ArrowLeft, KeyRound } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Email atau kata sandi salah.');
                setIsProcessing(false);
                return;
            }

            // Redirect to admin orders
            router.push('/admin/orders');
            router.refresh();
        } catch (err) {
            console.error('Login error:', err);
            setError('Gagal menghubungi server.');
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#0E1013] text-[#121417] dark:text-white flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans transition-colors">
            {/* Top Right Theme Toggle */}
            <div className="absolute top-6 right-6 z-20">
                <ThemeToggle />
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex justify-center mb-3">
                        <MetaMaskLogo className="w-12 h-12" textSize="text-2xl" />
                    </div>
                    <p className="text-sm font-semibold text-[#6B7280] dark:text-[#9CA3AF] mt-1">
                        Portal Administrator Ambeverages
                    </p>
                </div>

                <div className="bg-white dark:bg-[#15171C] border border-[#E5E8EC] dark:border-[#262A32] rounded-[32px] p-8 shadow-[0_16px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.4)] transition-colors">
                    <h2 className="text-xl font-extrabold text-[#121417] dark:text-white mb-6 flex items-center gap-2">
                        <KeyRound className="w-5 h-5 text-[#FA4B00]" />
                        <span>Masuk ke Dashboard</span>
                    </h2>

                    {error && (
                        <div className="mb-4 p-3 rounded-xl bg-[#FEE2E2] dark:bg-[#3D1E24] text-[#D73A49] dark:text-[#F87171] text-xs font-bold">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#4B5563] dark:text-[#9CA3AF] mb-1.5">
                                Email Admin
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9CA3AF]">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@example.com"
                                    required
                                    autoComplete="off"
                                    className="w-full pl-10 pr-4 py-2.5 bg-[#F7F8FA] dark:bg-[#1A1D23] border border-[#DCE0E5] dark:border-[#2C313B] focus:border-[#FA4B00] rounded-xl text-[#121417] dark:text-white placeholder-[#9CA3AF] text-sm transition-colors outline-none"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#4B5563] dark:text-[#9CA3AF] mb-1.5">
                                Kata Sandi
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9CA3AF]">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    autoComplete="new-password"
                                    className="w-full pl-10 pr-4 py-2.5 bg-[#F7F8FA] dark:bg-[#1A1D23] border border-[#DCE0E5] dark:border-[#2C313B] focus:border-[#FA4B00] rounded-xl text-[#121417] dark:text-white placeholder-[#9CA3AF] text-sm transition-colors outline-none"
                                />
                            </div>
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center justify-between text-xs">
                            <label className="flex items-center gap-2 cursor-pointer text-[#4B5563] dark:text-[#9CA3AF]">
                                <input
                                    type="checkbox"
                                    checked={remember}
                                    onChange={(e) => setRemember(e.target.checked)}
                                    className="rounded border-[#DCE0E5] dark:border-[#2C313B] text-[#FA4B00] focus:ring-[#FA4B00]"
                                />
                                <span>Ingat sesi masuk</span>
                            </label>
                        </div>

                        <Button
                            type="submit"
                            variant="orange"
                            size="lg"
                            className="w-full font-bold shadow-md"
                            disabled={isProcessing}
                        >
                            {isProcessing ? 'Memproses...' : 'Masuk ke Panel'}
                        </Button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-[#F0F2F5] dark:border-[#24272D] text-center">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-xs font-bold text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#FA4B00] transition-colors"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Kembali ke Katalog Pelanggan</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
