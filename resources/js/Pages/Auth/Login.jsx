import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import MetaMaskLogo from '../../Components/MetaMaskLogo';
import Button from '../../Components/Button';
import Card from '../../Components/Card';
import { Lock, Mail, ArrowLeft, KeyRound, Sparkles } from 'lucide-react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: 'admin@example.com',
        password: 'password',
        remember: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/login');
    };

    const handleFillDemo = () => {
        setData({
            email: 'admin@example.com',
            password: 'password',
            remember: true,
        });
    };

    return (
        <div className="min-h-screen bg-[#121416] flex flex-col justify-center items-center p-4 relative overflow-hidden">
            <Head title="Admin Login" />

            {/* Subtle glow background */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#F6851B]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex justify-center mb-3">
                        <MetaMaskLogo className="w-12 h-12" textSize="text-2xl" />
                    </div>
                    <p className="text-sm text-[#8F96A0] mt-1">
                        Portal Administrator MetaDrink
                    </p>
                </div>

                <Card className="border-[#2D3139] bg-[#181A1D]/90 backdrop-blur-xl p-8 rounded-3xl shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <KeyRound className="w-5 h-5 text-[#F6851B]" />
                        <span>Masuk ke Dashboard</span>
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-[#BBC0C5] mb-2">
                                Email Admin
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8F96A0]">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="admin@example.com"
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 bg-[#121416] border border-[#2F343C] focus:border-[#F6851B] focus:ring-1 focus:ring-[#F6851B] rounded-xl text-white placeholder-[#5A606A] text-sm transition-colors outline-none"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-xs text-[#FF6B7A] mt-1.5">{errors.email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-[#BBC0C5] mb-2">
                                Kata Sandi
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8F96A0]">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 bg-[#121416] border border-[#2F343C] focus:border-[#F6851B] focus:ring-1 focus:ring-[#F6851B] rounded-xl text-white placeholder-[#5A606A] text-sm transition-colors outline-none"
                                />
                            </div>
                            {errors.password && (
                                <p className="text-xs text-[#FF6B7A] mt-1.5">{errors.password}</p>
                            )}
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center justify-between text-xs text-[#8F96A0]">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded border-[#2F343C] bg-[#121416] text-[#F6851B] focus:ring-0 focus:ring-offset-0"
                                />
                                <span>Ingat saya</span>
                            </label>
                            <button
                                type="button"
                                onClick={handleFillDemo}
                                className="inline-flex items-center gap-1 text-[#F6851B] hover:underline"
                            >
                                <Sparkles className="w-3 h-3" />
                                <span>Gunakan Akun Demo</span>
                            </button>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            className="w-full font-bold shadow-[0_4px_20px_rgba(246,133,27,0.35)]"
                            disabled={processing}
                        >
                            {processing ? 'Memproses Masuk...' : 'Masuk ke Dashboard Admin'}
                        </Button>
                    </form>
                </Card>

                {/* Back to store */}
                <div className="text-center mt-6">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-xs font-medium text-[#8F96A0] hover:text-[#F6851B] transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Kembali ke Katalog Minuman</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
