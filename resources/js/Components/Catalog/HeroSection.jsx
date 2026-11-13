import React from 'react';
import { Flame, Search } from 'lucide-react';

export default function HeroSection({
    categories = [],
    selectedCategory = 'Semua',
    onSelectCategory,
    searchQuery = '',
    onSearchChange,
}) {
    return (
        <section className="relative overflow-hidden pt-12 pb-16 bg-white border-b border-[#E5E8EC]">
            {/* Ambient gradients */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FA4B00]/8 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#B9F24B]/15 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                {/* Eyebrow Pill */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF3EB] border border-[#FA4B00]/25 text-[#FA4B00] text-xs font-bold uppercase tracking-wider mb-5">
                    <Flame className="w-4 h-4 fill-[#FA4B00]" />
                    <span>Artisanal Coffee & Beverage Store</span>
                </div>

                {/* Headline */}
                <h1 className="text-4xl sm:text-6xl font-extrabold text-[#121417] tracking-tight mb-5 max-w-3xl mx-auto leading-[1.12]">
                    Crafted Drinks for <br className="hidden sm:inline" />
                    <span className="text-[#FA4B00]">Web3 Enthusiasts.</span>
                </h1>

                {/* Subtitle */}
                <p className="text-base sm:text-lg text-[#6B7280] max-w-2xl mx-auto mb-8 font-medium leading-relaxed">
                    Pesan minuman favorit Anda tanpa registrasi akun. Rincian pesanan otomatis tersambung ke WhatsApp admin dan stok akan terpotong seketika dikonfirmasi.
                </p>

                {/* MetaMask Segmented Capsule Pill Tabs */}
                <div className="inline-flex flex-wrap items-center justify-center p-1.5 rounded-full bg-[#ECEFF2] border border-[#DCE0E5] shadow-inner max-w-full overflow-x-auto gap-1 mb-8">
                    <button
                        type="button"
                        onClick={() => onSelectCategory('Semua')}
                        className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                            selectedCategory === 'Semua'
                                ? 'bg-[#121417] text-white shadow-md'
                                : 'text-[#6B7280] hover:text-[#121417]'
                        }`}
                    >
                        Semua Menu
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => onSelectCategory(cat)}
                            className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                                selectedCategory === cat
                                    ? 'bg-[#121417] text-white shadow-md'
                                    : 'text-[#6B7280] hover:text-[#121417]'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Search Pill Bar */}
                <div className="max-w-md mx-auto relative">
                    <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Cari menu kopi, matcha, tea..."
                        className="w-full pl-12 pr-4 py-3 bg-[#F7F8FA] border border-[#DCE0E5] focus:border-[#FA4B00] focus:bg-white rounded-full text-[#121417] placeholder-[#9CA3AF] text-sm transition-all outline-none shadow-sm"
                    />
                </div>
            </div>
        </section>
    );
}
