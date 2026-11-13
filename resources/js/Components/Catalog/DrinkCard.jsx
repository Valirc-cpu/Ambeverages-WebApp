import React from 'react';
import { motion } from 'framer-motion';
import Badge from '../Badge';
import Button from '../Button';
import { Coffee, Plus } from 'lucide-react';

export default function DrinkCard({ drink, onAddToCart }) {
    const isOutOfStock = drink.stock <= 0;
    const isLowStock = drink.stock > 0 && drink.stock <= 5;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            whileHover={!isOutOfStock ? { y: -4, transition: { duration: 0.15 } } : {}}
            className="bg-white dark:bg-[#16181D] border border-[#E5E8EC] dark:border-[#272B33] rounded-[26px] p-5 shadow-[0_4px_16px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.07)] hover:border-[#CBD2D9] dark:hover:border-[#383E4A] transition-all flex flex-col justify-between group"
        >
            <div>
                {/* Beverage Image Frame */}
                <div className="relative aspect-[4/3] w-full bg-[#F4F5F7] dark:bg-[#1D2026] rounded-[18px] overflow-hidden mb-4 border border-[#ECEFF2] dark:border-[#2B303A]">
                    {drink.image_url ? (
                        <img
                            src={drink.image_url}
                            alt={drink.name}
                            className={`w-full h-full object-cover transition-transform duration-300 ${
                                isOutOfStock ? 'grayscale opacity-40' : 'group-hover:scale-105'
                            }`}
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-[#9CA3AF]">
                            <Coffee className="w-12 h-12 mb-1" />
                            <span className="text-xs font-semibold">MetaDrink</span>
                        </div>
                    )}

                    {/* Category Tag */}
                    <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#121417] dark:bg-[#1E222A] text-white border border-transparent dark:border-[#353C48]">
                            {drink.category}
                        </span>
                    </div>

                    {/* Stock Indicator */}
                    <div className="absolute top-3 right-3">
                        {isOutOfStock ? (
                            <Badge variant="danger" size="xs">
                                Stok Habis
                            </Badge>
                        ) : isLowStock ? (
                            <Badge variant="warning" size="xs">
                                Sisa {drink.stock}
                            </Badge>
                        ) : (
                            <Badge variant="success" size="xs">
                                {drink.stock} Tersedia
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Details */}
                <h3 className="font-extrabold text-base text-[#121417] dark:text-white group-hover:text-[#FA4B00] transition-colors line-clamp-1">
                    {drink.name}
                </h3>
                <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-1.5 line-clamp-2 min-h-[32px] font-normal leading-relaxed">
                    {drink.description || 'Minuman segar diracik khusus untuk menemani aktivitas harian Anda.'}
                </p>
            </div>

            {/* Price & Action Row */}
            <div className="pt-4 mt-4 border-t border-[#F0F2F5] dark:border-[#24272D] flex items-center justify-between gap-3">
                <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#9CA3AF] block">
                        Harga
                    </span>
                    <span className="text-lg font-extrabold text-[#121417] dark:text-white">
                        {drink.formatted_price}
                    </span>
                </div>

                <motion.div whileTap={{ scale: 0.92 }}>
                    <Button
                        variant={isOutOfStock ? 'secondary' : 'orange'}
                        size="sm"
                        disabled={isOutOfStock}
                        onClick={() => onAddToCart(drink)}
                        className="shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                        <span>{isOutOfStock ? 'Habis' : 'Pesan'}</span>
                    </Button>
                </motion.div>
            </div>
        </motion.div>
    );
}
