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
        <section className="relative pt-12 pb-16 bg-white border-b border-[#E5E8EC]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Header with Interactive Fox */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10">
                    <div className="text-left max-w-2xl">
                        <motion.h1
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="text-4xl sm:text-6xl font-extrabold text-[#121417] tracking-tight leading-[1.08]"
                        >
                            Specialty Brews. <br />
                            <span className="text-[#FA4B00]">Instant WhatsApp Checkout.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            className="text-base sm:text-lg text-[#4B5563] font-medium mt-4 leading-relaxed max-w-xl"
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
                        <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#9CA3AF]">
                            Hover & Drag Fox
                        </span>
                    </motion.div>
                </div>

                {/* Controls Bar: Animated Pill Switcher & Search */}
                <div className="pt-6 border-t border-[#F0F2F5] flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    {/* Framer Motion Sliding Pill Tabs */}
                    <div className="flex items-center gap-1.5 p-1.5 bg-[#F2F4F7] rounded-full border border-[#DCE0E5] overflow-x-auto scrollbar-none max-w-full">
                        {allCategories.map((cat) => {
                            const isSelected = selectedCategory === cat;
                            return (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => onSelectCategory(cat)}
                                    className={`relative px-5 py-2 text-xs font-bold whitespace-nowrap transition-colors select-none ${
                                        isSelected ? 'text-white' : 'text-[#6B7280] hover:text-[#121417]'
                                    }`}
                                >
                                    {isSelected && (
                                        <motion.div
                                            layoutId="active-category-pill"
                                            className="absolute inset-0 bg-[#121417] rounded-full shadow-sm"
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
                            className="w-full pl-10 pr-9 py-2.5 bg-white border border-[#DCE0E5] focus:border-[#FA4B00] rounded-full text-[#121417] placeholder-[#9CA3AF] text-xs font-medium outline-none shadow-xs transition-colors"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => onSearchChange('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#121417] p-1"
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
