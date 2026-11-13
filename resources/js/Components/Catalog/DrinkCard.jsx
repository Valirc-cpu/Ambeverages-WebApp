import React from 'react';
import Badge from '../Badge';
import Button from '../Button';
import { Coffee, Plus } from 'lucide-react';

export default function DrinkCard({ drink, onAddToCart }) {
    const isOutOfStock = drink.stock <= 0;
    const isLowStock = drink.stock > 0 && drink.stock <= 5;

    return (
        <div className="bg-white border border-[#E5E8EC] rounded-[28px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group">
            <div>
                {/* Beverage Image */}
                <div className="relative aspect-[4/3] w-full bg-[#F2F4F7] rounded-[20px] overflow-hidden mb-4">
                    {drink.image_url ? (
                        <img
                            src={drink.image_url}
                            alt={drink.name}
                            className={`w-full h-full object-cover transition-transform duration-300 ${
                                isOutOfStock ? 'grayscale opacity-50' : 'group-hover:scale-105'
                            }`}
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-[#9CA3AF]">
                            <Coffee className="w-12 h-12 mb-1" />
                            <span className="text-xs font-semibold">MetaDrink</span>
                        </div>
                    )}

                    {/* Category Tag Pill */}
                    <div className="absolute top-3 left-3">
                        <Badge variant="dark" size="xs" className="bg-[#121417]/85 backdrop-blur-md">
                            {drink.category}
                        </Badge>
                    </div>

                    {/* Stock Indicator Badge */}
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

                {/* Drink Information */}
                <h3 className="font-extrabold text-base text-[#121417] group-hover:text-[#FA4B00] transition-colors line-clamp-1">
                    {drink.name}
                </h3>
                <p className="text-xs text-[#6B7280] mt-1.5 line-clamp-2 min-h-[32px] font-normal leading-relaxed">
                    {drink.description || 'Minuman segar diracik khusus untuk menemani aktivitas harian Anda.'}
                </p>
            </div>

            {/* Price & Action Row */}
            <div className="pt-4 mt-4 border-t border-[#F0F2F5] flex items-center justify-between gap-3">
                <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#9CA3AF] block">
                        Harga
                    </span>
                    <span className="text-lg font-extrabold text-[#121417]">
                        {drink.formatted_price}
                    </span>
                </div>

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
            </div>
        </div>
    );
}
