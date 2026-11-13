import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import InteractiveFox from '../InteractiveFox';

export default function HeroSection({
    categories = [],
    selectedCategory = 'Semua',
    onSelectCategory,
    searchQuery = '',
    onSearchChange,
}) {
    const searchInputRef = useRef(null);
    const allCategories = ['Semua', ...categories];

    return (
        <section className="relative pt-12 pb-16 bg-white dark:bg-[#121417] border-b border-[#E5E8EC] dark:border-[#24272D] transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Header with Interactive Fox */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10">
                    <div className="text-left max-w-2xl">
                        <motion.h1
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="text-4xl sm:text-6xl font-extrabold text-[#121417] dark:text-white tracking-tight leading-[1.08]"
                        >
                            Specialty Brews. <br />
                            <span className="text-[#FA4B00]">Instant WhatsApp Checkout.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            className="text-base sm:text-lg text-[#4B5563] dark:text-[#9CA3AF] font-medium mt-4 leading-relaxed max-w-xl"
                        >
                            Pilih menu kopi atau minuman dingin favoritmu. Pesan langsung tanpa registrasi akun, rincian terkirim ke WhatsApp, dan stok otomatis terpotong saat pesanan dikonfirmasi.
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

                {/* Controls Bar: Animated Pill Switcher & Search */}
                <div className="pt-6 border-t border-[#F0F2F5] dark:border-[#24272D] flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    {/* Framer Motion Sliding Pill Tabs */}
                    <div className="flex items-center gap-1.5 p-1.5 bg-[#F2F4F7] dark:bg-[#181A1F] rounded-full border border-[#DCE0E5] dark:border-[#282C34] overflow-x-auto scrollbar-none max-w-full">
                        {allCategories.map((cat) => {
                            const isSelected = selectedCategory === cat;
                            return (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => onSelectCategory(cat)}
                                    className={`relative px-5 py-2 text-xs font-bold whitespace-nowrap transition-colors select-none ${
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

                    {/* Search Field */}
                    <div className="relative min-w-[280px] sm:w-80">
                        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder="Cari menu kopi, matcha, tea..."
                            className="w-full pl-10 pr-9 py-2.5 bg-white dark:bg-[#181A1F] border border-[#DCE0E5] dark:border-[#282C34] focus:border-[#FA4B00] rounded-full text-[#121417] dark:text-white placeholder-[#9CA3AF] text-xs font-medium outline-none shadow-xs transition-colors"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => onSearchChange('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#121417] dark:hover:text-white p-1"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
