import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
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

                {/* Controls Bar: Category Selection (Dropdown on Mobile, Capsules on Desktop) */}
                <div className="pt-6 border-t border-[#F0F2F5] dark:border-[#24272D] flex items-center justify-between">
                    {/* Mobile Category Dropdown Selector */}
                    <div className="sm:hidden w-full">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#9CA3AF] mb-1.5 block">
                            Pilih Kategori Menu
                        </label>
                        <div className="relative">
                            <select
                                value={selectedCategory}
                                onChange={(e) => onSelectCategory(e.target.value)}
                                className="w-full appearance-none pl-4 pr-10 py-3 rounded-2xl bg-[#F2F4F7] dark:bg-[#181A1F] border border-[#DCE0E5] dark:border-[#282C34] text-[#121417] dark:text-white font-bold text-sm outline-none focus:border-[#FA4B00] shadow-xs cursor-pointer transition-colors"
                            >
                                {allCategories.map((cat) => (
                                    <option key={cat} value={cat} className="bg-white dark:bg-[#15171C] text-[#121417] dark:text-white font-bold py-1">
                                        {cat === 'Semua' ? 'Semua Menu' : cat}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#6B7280] dark:text-[#9CA3AF]">
                                <ChevronDown className="w-4 h-4" />
                            </div>
                        </div>
                    </div>

                    {/* Desktop Sliding Capsule Pills */}
                    <div className="hidden sm:flex items-center gap-1.5 p-1.5 bg-[#F2F4F7] dark:bg-[#181A1F] rounded-full border border-[#DCE0E5] dark:border-[#282C34] overflow-x-auto scrollbar-none">
                        {allCategories.map((cat) => {
                            const isSelected = selectedCategory === cat;
                            return (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => onSelectCategory(cat)}
                                    className={`relative px-5 py-2 text-xs font-bold whitespace-nowrap transition-colors select-none cursor-pointer ${
                                        isSelected ? 'text-white' : 'text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#121417] dark:hover:text-white'
                                    }`}
                                >
                                    {isSelected && (
                                        <motion.div
                                            layoutId="active-category-pill"
                                            className="absolute inset-0 bg-[#121417] dark:bg-[#FA4B00] rounded-full shadow-sm"
                                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                    <span className="relative z-10">{cat === 'Semua' ? 'Semua Menu' : cat}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
