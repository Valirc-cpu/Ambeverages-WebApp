import React from 'react';
import Modal from '../Modal';
import Button from '../Button';
import { ShoppingBag, Coffee, Minus, Plus, Trash2, User, Send } from 'lucide-react';

export default function CartModal({
    isOpen,
    onClose,
    cart = [],
    onUpdateQuantity,
    onRemoveFromCart,
    cartTotal = 0,
    checkoutForm,
    onCheckout,
}) {
    const { data, setData, processing, errors } = checkoutForm;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Keranjang Pesanan"
            maxWidth="max-w-xl"
        >
            {cart.length === 0 ? (
                <div className="text-center py-12">
                    <ShoppingBag className="w-14 h-14 text-[#CBD2D9] mx-auto mb-3" />
                    <p className="text-base font-bold text-[#121417]">Keranjang Anda masih kosong</p>
                    <p className="text-xs text-[#6B7280] mt-1">
                        Pilih minuman favorit Anda dari menu untuk memulai pesanan.
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Cart Items List */}
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                        {cart.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#F7F8FA] border border-[#E5E8EC]"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    {item.image_url ? (
                                        <img
                                            src={item.image_url}
                                            alt={item.name}
                                            className="w-12 h-12 rounded-xl object-cover bg-gray-200 shrink-0"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center text-gray-500 shrink-0">
                                            <Coffee className="w-6 h-6" />
                                        </div>
                                    )}
                                    <div className="truncate">
                                        <h4 className="text-sm font-bold text-[#121417] truncate">{item.name}</h4>
                                        <span className="text-xs text-[#FA4B00] font-extrabold">{item.formatted_price}</span>
                                    </div>
                                </div>

                                {/* Stepper Controls */}
                                <div className="flex items-center gap-3 shrink-0">
                                    <div className="flex items-center bg-white border border-[#DCE0E5] rounded-full p-1 shadow-sm">
                                        <button
                                            type="button"
                                            onClick={() => onUpdateQuantity(item.id, -1)}
                                            className="p-1 text-[#6B7280] hover:text-[#121417] transition-colors"
                                        >
                                            <Minus className="w-3.5 h-3.5" />
                                        </button>
                                        <span className="px-2.5 text-xs font-extrabold text-[#121417] min-w-[20px] text-center">
                                            {item.quantity}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => onUpdateQuantity(item.id, 1)}
                                            className="p-1 text-[#6B7280] hover:text-[#121417] transition-colors"
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                        </button>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => onRemoveFromCart(item.id)}
                                        className="text-[#9CA3AF] hover:text-[#D73A49] p-1.5 transition-colors"
                                        title="Hapus"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary Subtotal */}
                    <div className="p-4 rounded-2xl bg-[#FFF3EB] border border-[#FA4B00]/25 flex items-center justify-between">
                        <span className="text-sm font-semibold text-[#121417]">Total Tagihan Pesanan:</span>
                        <span className="text-xl font-extrabold text-[#FA4B00]">
                            Rp {new Intl.NumberFormat('id-ID').format(cartTotal)}
                        </span>
                    </div>

                    {/* Customer Form */}
                    <form onSubmit={onCheckout} className="space-y-4 pt-2 border-t border-[#F0F2F5]">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#121417] flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-[#FA4B00]" />
                            <span>Data Pemesan (Guest / Tanpa Akun)</span>
                        </h4>

                        <div>
                            <label className="block text-xs font-bold text-[#4B5563] mb-1">
                                Nama Lengkap <span className="text-[#D73A49]">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.customer_name}
                                onChange={(e) => setData('customer_name', e.target.value)}
                                placeholder="Contoh: Budi Santoso"
                                required
                                className="w-full px-4 py-2.5 bg-[#F7F8FA] border border-[#DCE0E5] focus:border-[#FA4B00] focus:bg-white rounded-xl text-[#121417] placeholder-[#9CA3AF] text-sm outline-none transition-colors"
                            />
                            {errors.customer_name && (
                                <p className="text-xs text-[#D73A49] mt-1">{errors.customer_name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#4B5563] mb-1">
                                Nomor WhatsApp (Aktif) <span className="text-[#D73A49]">*</span>
                            </label>
                            <input
                                type="tel"
                                value={data.customer_phone}
                                onChange={(e) => setData('customer_phone', e.target.value)}
                                placeholder="Contoh: 08123456789"
                                required
                                className="w-full px-4 py-2.5 bg-[#F7F8FA] border border-[#DCE0E5] focus:border-[#FA4B00] focus:bg-white rounded-xl text-[#121417] placeholder-[#9CA3AF] text-sm outline-none transition-colors"
                            />
                            <span className="text-[11px] text-[#6B7280] mt-1 block">
                                Admin akan memverifikasi dan mengonfirmasi pesanan ke nomor ini
                            </span>
                            {errors.customer_phone && (
                                <p className="text-xs text-[#D73A49] mt-1">{errors.customer_phone}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#4B5563] mb-1">
                                Catatan Tambahan (Opsional)
                            </label>
                            <textarea
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                placeholder="Contoh: Es dipisah, less sugar..."
                                rows={2}
                                className="w-full px-4 py-2.5 bg-[#F7F8FA] border border-[#DCE0E5] focus:border-[#FA4B00] focus:bg-white rounded-xl text-[#121417] placeholder-[#9CA3AF] text-sm outline-none resize-none transition-colors"
                            />
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="whatsapp"
                            size="lg"
                            disabled={processing}
                            className="w-full font-bold shadow-[0_6px_20px_rgba(37,211,102,0.35)]"
                        >
                            <Send className="w-4 h-4" />
                            <span>{processing ? 'Menyiapkan Pesanan...' : 'Pesan Sekarang via WhatsApp'}</span>
                        </Button>
                    </form>
                </div>
            )}
        </Modal>
    );
}
