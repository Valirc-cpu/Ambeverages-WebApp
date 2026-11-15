import React from 'react';
import { motion } from 'framer-motion';
import InteractiveFox from '../InteractiveFox';

export default function HeroSection({
    categories = [],
    selectedCategory = 'Semua',
    onSelectCategory,
}) {
    const allCategories = ['Semua', ...categories];

    return (
        <section className="relative pt-12 pb-16 bg-white/80 dark:bg-[#121417]/80 backdrop-blur-md border-b border-[#E5E8EC] dark:border-[#24272D] transition-colors z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Header with Interactive Fox */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10">
                    <div className="text-left max-w-2xl">
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
                            Nikmati sensasi kesegaran Ambmanggo, Amberry, dan Ambpinaple. Pesan cepat tanpa registrasi akun, rincian terkirim ke WhatsApp, dan stok terpotong otomatis saat pesanan dikonfirmasi.
                        </motion.p>
                    </div>

                    {/* Interactive 3D Perspective Fox */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                        className="flex flex-col items-center gap-2 shrink-0"
                    >
                        <InteractiveFox size={120} />
                        <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#9CA3AF] dark:text-[#6B7280]">
                            Hover & Drag Fox
                        </span>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
