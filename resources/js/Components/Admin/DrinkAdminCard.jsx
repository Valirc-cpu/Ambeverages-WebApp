import React from 'react';
import Badge from '../Badge';
import Button from '../Button';
import { Coffee, Edit2, Trash2 } from 'lucide-react';

export default function DrinkAdminCard({
    drink,
    quickStockUpdating,
    onQuickStockChange,
    onOpenEdit,
    onOpenDelete,
}) {
    const isOutOfStock = drink.stock <= 0;
    const isLowStock = drink.stock > 0 && drink.stock <= 5;

    return (
        <div className="p-5 bg-white dark:bg-[#15171C] border border-[#E5E8EC] dark:border-[#262A32] rounded-[28px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] transition-all flex flex-col justify-between">
            <div>
                {/* Image & Badges */}
                <div className="relative aspect-video w-full bg-[#F2F4F7] dark:bg-[#1A1D23] rounded-[20px] overflow-hidden mb-3.5 border border-transparent dark:border-[#282C34]">
                    {drink.image_url ? (
                        <img
                            src={drink.image_url}
                            alt={drink.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#9CA3AF]">
                            <Coffee className="w-10 h-10" />
                        </div>
                    )}

                    <div className="absolute top-2.5 left-2.5">
                        <Badge variant="dark" size="xs" className="bg-[#121417]/80 backdrop-blur-md">
                            {drink.category}
                        </Badge>
                    </div>

                    <div className="absolute top-2.5 right-2.5">
                        {isOutOfStock ? (
                            <Badge variant="danger" size="xs">Habis</Badge>
                        ) : isLowStock ? (
                            <Badge variant="warning" size="xs">Kritis ({drink.stock})</Badge>
                        ) : (
                            <Badge variant="success" size="xs">{drink.stock} Unit</Badge>
                        )}
                    </div>
                </div>

                <h3 className="font-extrabold text-[#121417] dark:text-white text-sm line-clamp-1">{drink.name}</h3>
                <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-1 line-clamp-2 min-h-[32px] leading-relaxed">
                    {drink.description || 'Tidak ada deskripsi.'}
                </p>
                <div className="text-base font-extrabold text-[#FA4B00] mt-2">
                    {drink.formatted_price}
                </div>
            </div>

            {/* Quick Stock Controls & Actions */}
            <div className="pt-3.5 mt-3.5 border-t border-[#F0F2F5] dark:border-[#24272D] space-y-3">
                {/* Quick Stock Stepper */}
                <div className="flex items-center justify-between bg-[#F7F8FA] dark:bg-[#1A1D24] border border-[#E5E8EC] dark:border-[#292D36] rounded-full p-1 text-xs">
                    <span className="text-[11px] font-bold text-[#6B7280] dark:text-[#9CA3AF] pl-2.5">
                        Stok Fisik:
                    </span>
                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            disabled={drink.stock <= 0 || quickStockUpdating === drink.id}
                            onClick={() => onQuickStockChange(drink, -1)}
                            className="w-6 h-6 rounded-full bg-white dark:bg-[#14161B] hover:bg-gray-100 dark:hover:bg-[#20242E] text-[#121417] dark:text-white font-bold flex items-center justify-center border border-[#DCE0E5] dark:border-[#2C313B] shadow-xs disabled:opacity-30"
                            title="Kurangi stok 1"
                        >
                            -
                        </button>
                        <span className="w-8 text-center font-extrabold text-[#121417] dark:text-white">
                            {drink.stock}
                        </span>
                        <button
                            type="button"
                            disabled={quickStockUpdating === drink.id}
                            onClick={() => onQuickStockChange(drink, 1)}
                            className="w-6 h-6 rounded-full bg-white dark:bg-[#14161B] hover:bg-gray-100 dark:hover:bg-[#20242E] text-[#121417] dark:text-white font-bold flex items-center justify-center border border-[#DCE0E5] dark:border-[#2C313B] shadow-xs disabled:opacity-30"
                            title="Tambah stok 1"
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Edit / Delete Buttons */}
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onOpenEdit(drink)}
                        className="flex-1 text-xs font-bold dark:bg-[#191C22] dark:border-[#2C313B] dark:text-white"
                    >
                        <Edit2 className="w-3.5 h-3.5 text-[#6B7280] dark:text-[#9CA3AF]" />
                        <span>Edit</span>
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onOpenDelete(drink)}
                        className="text-[#9CA3AF] hover:text-[#D73A49] p-2"
                        title="Hapus"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
