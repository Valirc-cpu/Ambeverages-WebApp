import React from 'react';
import { motion } from 'framer-motion';
import Badge from '../Badge';
import Button from '../Button';
import { Coffee, Plus, CheckCircle2 } from 'lucide-react';

export default function DrinkCard({
    drink,
    onAddToCart,
    isHighlighted = false,
    className = '',
    onSelect,
}) {
    const isOutOfStock = drink.stock <= 0;
    const isLowStock = drink.stock > 0 && drink.stock <= 5;

    return (
        <div
            onClick={onSelect}
            className={`w-full bg-white dark:bg-[#15171C] rounded-[28px] p-5 sm:p-7 transition-all duration-300 relative overflow-hidden flex flex-col md:flex-row items-center gap-6 sm:gap-8 ${
                isHighlighted
                    ? 'border-2 border-[#FA4B00] dark:border-[#FA4B00] shadow-md dark:shadow-black/50'
                    : 'border border-[#E5E8EC] dark:border-[#272B33] shadow-xs hover:border-[#CBD2D9] dark:hover:border-[#383E4A]'
            } ${className}`}
        >
            {/* Left Image Section */}
            <div className="w-full md:w-80 lg:w-96 h-56 sm:h-64 rounded-[22px] overflow-hidden relative shrink-0 bg-[#F4F5F7] dark:bg-[#1D2026] border border-[#ECEFF2] dark:border-[#2B303A]">
                {drink.image_url ? (
                    <img
                        src={drink.image_url}
                        alt={drink.name}
                        className={`w-full h-full object-cover transition-transform duration-500 ${
                            isOutOfStock ? 'grayscale opacity-40' : 'group-hover:scale-105'
                        }`}
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#9CA3AF]">
                        <Coffee className="w-16 h-16 mb-2 text-[#CBD2D9] dark:text-[#383E4A]" />
                        <span className="text-xs font-bold uppercase tracking-wider">MetaDrink Craft</span>
                    </div>
                )}

                {/* Category Badge on Image */}
                <div className="absolute top-3.5 left-3.5">
                    <span className="px-3 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#121417]/85 dark:bg-[#1E222A]/85 backdrop-blur-md text-white border border-white/10">
                        {drink.category}
                    </span>
                </div>

                {/* Stock Indicator on Image */}
                <div className="absolute top-3.5 right-3.5">
                    {isOutOfStock ? (
                        <Badge variant="danger" size="sm">
                            Stok Habis
                        </Badge>
                    ) : isLowStock ? (
                        <Badge variant="warning" size="sm">
                            Sisa {drink.stock} Porsi
                        </Badge>
                    ) : (
                        <Badge variant="success" size="sm">
                            {drink.stock} Tersedia
                        </Badge>
                    )}
                </div>

                {/* Clean Highlight Badge */}
                {isHighlighted && (
                    <div className="absolute bottom-3 left-3">
                        <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-[#121417] dark:bg-white text-white dark:text-[#121417] border border-transparent dark:border-[#333]">
                            Menu Sorotan
                        </span>
                    </div>
                )}
            </div>

            {/* Right Content Section */}
            <div className="flex-1 flex flex-col justify-between w-full h-full py-1">
                <div>
                    {/* Header info */}
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF] flex items-center gap-1.5">
                            <Coffee className="w-3.5 h-3.5 text-[#FA4B00]" />
                            <span>Batch #{String(drink.id).padStart(2, '0')} • Handcrafted Beverage</span>
                        </span>
                    </div>

                    {/* Drink Name */}
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-[#121417] dark:text-white transition-colors leading-tight">
                        {drink.name}
                    </h3>

                    {/* Description */}
                    <p className="text-sm sm:text-base text-[#6B7280] dark:text-[#9CA3AF] mt-3 leading-relaxed line-clamp-3 font-normal">
                        {drink.description || 'Minuman segar spesial racikan barista MetaDrink dengan kualitas bahan premium terpilih.'}
                    </p>

                    {/* Chips info */}
                    <div className="flex flex-wrap items-center gap-2 mt-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#F2F4F7] dark:bg-[#1E222A] text-[#4B5563] dark:text-[#9CA3AF] border border-[#E5E8EC] dark:border-[#2C313B]">
                            {drink.category}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#F2F4F7] dark:bg-[#1E222A] text-[#4B5563] dark:text-[#9CA3AF] border border-[#E5E8EC] dark:border-[#2C313B] flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#1EBE5D]" />
                            <span>Siap Diseduh</span>
                        </span>
                        {drink.stock > 0 && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#E8F8EE] dark:bg-[#142B1C] text-[#145D25] dark:text-[#7AE595] border border-[#B9F24B]/30">
                                Stok: {drink.stock} unit
                            </span>
                        )}
                    </div>
                </div>

                {/* Price and Order Button */}
                <div className="pt-5 sm:pt-6 mt-5 sm:mt-6 border-t border-[#F0F2F5] dark:border-[#24272D] flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <span className="text-[10px] sm:text-xs uppercase font-bold tracking-wider text-[#9CA3AF] block mb-0.5">
                            Harga Satuan
                        </span>
                        <div className="text-2xl sm:text-3xl font-black text-[#121417] dark:text-white">
                            {drink.formatted_price}
                        </div>
                    </div>

                    <motion.div whileTap={{ scale: 0.95 }}>
                        <Button
                            variant={isOutOfStock ? 'secondary' : 'orange'}
                            size="lg"
                            disabled={isOutOfStock}
                            onClick={(e) => {
                                e.stopPropagation();
                                onAddToCart(drink);
                            }}
                            className="px-6 sm:px-8 py-3.5 font-bold flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            <span>{isOutOfStock ? 'Stok Habis' : 'Pesan Sekarang'}</span>
                        </Button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
