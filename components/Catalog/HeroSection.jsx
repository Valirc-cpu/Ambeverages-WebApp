import React from 'react';
import { motion } from 'framer-motion';
import InteractiveFox from '../InteractiveFox';

export default function HeroSection({
    categories = [],
    selectedCategory = 'Semua',
    onSelectCategory,
    isStoreOpen = true,
}) {
    const allCategories = ['Semua', ...categories];

    return (
        <section className="relative pt-12 pb-16 bg-white/80 dark:bg-[#121417]/80 backdrop-blur-md border-b border-[#E5E8EC] dark:border-[#24272D] transition-colors z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Header with Interactive Fox */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10">
                    <div className="text-left max-w-2xl">
                        {!isStoreOpen ? (
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF5F5] dark:bg-[#2D1518] border border-[#D73A49]/30 text-[#D73A49] dark:text-[#F85149] text-xs font-bold mb-4">
                                <span className="w-2 h-2 rounded-full bg-[#D73A49] animate-pulse" />
                                <span>Kedai Sedang Tutup</span>
                            </div>
                        ) : (
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F8EE] dark:bg-[#142B1C] border border-[#1EBE5D]/30 text-[#1EBE5D] text-xs font-bold mb-4">
                                <span className="w-2 h-2 rounded-full bg-[#1EBE5D]" />
                                <span>Kedai Buka — Siap Melayani Pesanan</span>
                            </div>
                        )}

                        <motion.h1
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-[#121417] dark:text-white tracking-tight leading-none"
                        >
                            Ambeverages.
                            <span className="block text-base sm:text-lg font-bold text-[#FA4B00] tracking-wider mt-2.5">
                                I Am Beverages.
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            className="text-base sm:text-lg text-[#4B5563] dark:text-[#9CA3AF] font-medium mt-4 leading-relaxed max-w-xl"
                        >
                            Nikmati sensasi kesegaran Ambanas, Amberry, dan Ambanggo. Pesan cepat tanpa registrasi akun, rincian terkirim ke WhatsApp.
                        </motion.p>
                    </div>

                    {/* Brand Vector Logo (Matching left text height, borderless) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                        className="shrink-0 flex items-center justify-center"
                    >
                        <InteractiveFox className="w-48 h-48 sm:w-56 sm:h-56 md:w-60 md:h-60 lg:w-64 lg:h-64" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
