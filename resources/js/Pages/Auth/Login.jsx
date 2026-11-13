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
        <div className="min-h-screen bg-[#F7F8FA] flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
            <Head title="Admin Login" />

            {/* Ambient gradients */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FA4B00]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex justify-center mb-3">
                        <MetaMaskLogo className="w-12 h-12" textSize="text-2xl" />
                    </div>
                    <p className="text-sm font-semibold text-[#6B7280] mt-1">
                        Portal Administrator MetaDrink
                    </p>
                </div>

                <div className="bg-white border border-[#E5E8EC] rounded-[32px] p-8 shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
                    <h2 className="text-xl font-extrabold text-[#121417] mb-6 flex items-center gap-2">
                        <KeyRound className="w-5 h-5 text-[#FA4B00]" />
                        <span>Masuk ke Dashboard</span>
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#4B5563] mb-1.5">
                                Email Admin
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9CA3AF]">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="admin@example.com"
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 bg-[#F7F8FA] border border-[#DCE0E5] focus:border-[#FA4B00] focus:bg-white rounded-xl text-[#121417] placeholder-[#9CA3AF] text-sm transition-colors outline-none"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-xs text-[#D73A49] mt-1.5">{errors.email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#4B5563] mb-1.5">
                                Kata Sandi
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9CA3AF]">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 bg-[#F7F8FA] border border-[#DCE0E5] focus:border-[#FA4B00] focus:bg-white rounded-xl text-[#121417] placeholder-[#9CA3AF] text-sm transition-colors outline-none"
                                />
                            </div>
                            {errors.password && (
                                <p className="text-xs text-[#D73A49] mt-1.5">{errors.password}</p>
                            )}
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center justify-between text-xs text-[#6B7280]">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded border-[#DCE0E5] text-[#FA4B00] focus:ring-0"
                                />
                                <span>Ingat saya</span>
                            </label>
                            <button
                                type="button"
                                onClick={handleFillDemo}
                                className="inline-flex items-center gap-1 text-[#FA4B00] font-bold hover:underline"
                            >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Gunakan Akun Demo</span>
                            </button>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="orange"
                            size="lg"
                            className="w-full font-bold shadow-[0_4px_20px_rgba(250,75,0,0.3)]"
                            disabled={processing}
                        >
                            {processing ? 'Memproses Masuk...' : 'Masuk ke Dashboard Admin'}
                        </Button>
                    </form>
                </div>

                {/* Back to store */}
                <div className="text-center mt-6">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-xs font-bold text-[#6B7280] hover:text-[#FA4B00] transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Kembali ke Katalog Minuman</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
