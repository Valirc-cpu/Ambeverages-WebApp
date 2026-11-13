import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '../Modal';
import Button from '../Button';
import ReceiptSlip from './ReceiptSlip';
import { ShoppingBag, Coffee, Minus, Plus, Trash2, User, Send, Receipt } from 'lucide-react';

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
            title="Keranjang & Checkout WhatsApp"
            maxWidth="max-w-2xl"
        >
            {cart.length === 0 ? (
                <div className="text-center py-16">
                    <ShoppingBag className="w-14 h-14 text-[#CBD2D9] mx-auto mb-3" />
                    <p className="text-base font-bold text-[#121417]">Keranjang Anda masih kosong</p>
                    <p className="text-xs text-[#6B7280] mt-1">
                        Pilih minuman favorit Anda dari menu untuk memulai pesanan.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
                    {/* Left Column: Items List & Form */}
                    <div className="space-y-5">
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-2 flex items-center justify-between">
                                <span>Item Terpilih ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
                                <span className="text-[10px] text-[#FA4B00] font-semibold">Tersimpan di Keranjang</span>
                            </h4>

                            <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
                                <AnimatePresence>
                                    {cart.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-[#F7F8FA] border border-[#E5E8EC]"
                                        >
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                {item.image_url ? (
                                                    <img
                                                        src={item.image_url}
                                                        alt={item.name}
                                                        className="w-10 h-10 rounded-xl object-cover bg-gray-200 shrink-0"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center text-gray-500 shrink-0">
                                                        <Coffee className="w-5 h-5" />
                                                    </div>
                                                )}
                                                <div className="truncate">
                                                    <h5 className="text-xs font-bold text-[#121417] truncate">{item.name}</h5>
                                                    <span className="text-[11px] text-[#FA4B00] font-bold">{item.formatted_price}</span>
                                                </div>
                                            </div>

                                            {/* Stepper */}
                                            <div className="flex items-center gap-2 shrink-0">
                                                <div className="flex items-center bg-white border border-[#DCE0E5] rounded-full p-0.5 shadow-xs">
                                                    <button
                                                        type="button"
                                                        onClick={() => onUpdateQuantity(item.id, -1)}
                                                        className="p-1 text-[#6B7280] hover:text-[#121417] transition-colors"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="px-2 text-xs font-extrabold text-[#121417] min-w-[16px] text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => onUpdateQuantity(item.id, 1)}
                                                        className="p-1 text-[#6B7280] hover:text-[#121417] transition-colors"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => onRemoveFromCart(item.id)}
                                                    className="text-[#9CA3AF] hover:text-[#D73A49] p-1 transition-colors"
                                                    title="Hapus"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Customer Form */}
                        <form id="checkout-form" onSubmit={onCheckout} className="space-y-3 pt-3 border-t border-[#F0F2F5]">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-[#121417] flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5 text-[#FA4B00]" />
                                <span>Data Pemesan (Guest Checkout)</span>
                            </h4>

                            <div>
                                <label className="block text-[11px] font-bold text-[#4B5563] mb-1">
                                    Nama Lengkap <span className="text-[#D73A49]">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.customer_name}
                                    onChange={(e) => setData('customer_name', e.target.value)}
                                    placeholder="Contoh: Budi Santoso"
                                    required
                                    className="w-full px-3.5 py-2 bg-[#F7F8FA] border border-[#DCE0E5] focus:border-[#FA4B00] focus:bg-white rounded-xl text-[#121417] text-xs outline-none transition-colors"
                                />
                                {errors.customer_name && (
                                    <p className="text-xs text-[#D73A49] mt-1">{errors.customer_name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-[#4B5563] mb-1">
                                    Nomor WhatsApp <span className="text-[#D73A49]">*</span>
                                </label>
                                <input
                                    type="tel"
                                    value={data.customer_phone}
                                    onChange={(e) => setData('customer_phone', e.target.value)}
                                    placeholder="08123456789"
                                    required
                                    className="w-full px-3.5 py-2 bg-[#F7F8FA] border border-[#DCE0E5] focus:border-[#FA4B00] focus:bg-white rounded-xl text-[#121417] text-xs outline-none transition-colors"
                                />
                                {errors.customer_phone && (
                                    <p className="text-xs text-[#D73A49] mt-1">{errors.customer_phone}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-[#4B5563] mb-1">
                                    Catatan (Opsional)
                                </label>
                                <input
                                    type="text"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    placeholder="Less ice / Less sugar..."
                                    className="w-full px-3.5 py-2 bg-[#F7F8FA] border border-[#DCE0E5] focus:border-[#FA4B00] focus:bg-white rounded-xl text-[#121417] text-xs outline-none transition-colors"
                                />
                            </div>
                        </form>
                    </div>

                    {/* Right Column: Live Receipt Slip & Checkout Trigger */}
                    <div className="flex flex-col justify-between space-y-4">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-2 flex items-center gap-1.5">
                                <Receipt className="w-3.5 h-3.5 text-[#FA4B00]" />
                                <span>Preview Tiket Pesanan</span>
                            </span>

                            <ReceiptSlip
                                customerName={data.customer_name}
                                customerPhone={data.customer_phone}
                                items={cart}
                                totalPrice={cartTotal}
                                notes={data.notes}
                            />
                        </div>

                        <motion.div whileTap={{ scale: 0.98 }}>
                            <Button
                                form="checkout-form"
                                type="submit"
                                variant="whatsapp"
                                size="lg"
                                disabled={processing}
                                className="w-full font-bold shadow-[0_4px_16px_rgba(37,211,102,0.3)]"
                            >
                                <Send className="w-4 h-4" />
                                <span>{processing ? 'Menyiapkan...' : 'Kirim via WhatsApp'}</span>
                            </Button>
                        </motion.div>
                    </div>
                </div>
            )}
        </Modal>
    );
}
