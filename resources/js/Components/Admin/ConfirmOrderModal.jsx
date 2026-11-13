import React from 'react';
import Modal from '../Modal';
import Button from '../Button';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmOrderModal({
    order,
    onClose,
    onConfirm,
    processing = false,
}) {
    if (!order) return null;

    return (
        <Modal
            isOpen={!!order}
            onClose={onClose}
            title="Konfirmasi Pesanan & Potong Stok"
            maxWidth="max-w-md"
        >
            <div className="space-y-4 py-2">
                <div className="p-4 rounded-2xl bg-[#FFF3EB] dark:bg-[#2A180E] border border-[#FA4B00]/25 text-xs text-[#4B5563] dark:text-[#E0E2EC] flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-[#FA4B00] shrink-0 mt-0.5" />
                    <div>
                        <span className="font-extrabold text-[#121417] dark:text-white block mb-0.5">Konfirmasi Pesanan</span>
                        Mengonfirmasi pesanan ini akan <strong>otomatis mengurangi stok fisik</strong> masing-masing minuman di database secara realtime.
                    </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#F7F8FA] dark:bg-[#1A1D24] border border-[#E5E8EC] dark:border-[#282C34] space-y-1.5 text-xs">
                    <div className="flex justify-between">
                        <span className="text-[#6B7280] dark:text-[#9CA3AF]">Kode Pesanan:</span>
                        <span className="font-mono font-extrabold text-[#121417] dark:text-white">{order.order_code}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-[#6B7280] dark:text-[#9CA3AF]">Nama Pemesan:</span>
                        <span className="font-bold text-[#121417] dark:text-white">{order.customer_name}</span>
                    </div>
                    <div className="flex justify-between border-t border-[#E5E8EC] dark:border-[#282C34] pt-1.5">
                        <span className="text-[#6B7280] dark:text-[#9CA3AF]">Total Pembayaran:</span>
                        <span className="font-extrabold text-[#FA4B00] text-sm">{order.formatted_total_price}</span>
                    </div>
                </div>

                <div className="space-y-1 text-xs">
                    <span className="text-[#6B7280] dark:text-[#9CA3AF] font-bold block">Daftar item yang stoknya akan dipotong:</span>
                    <ul className="space-y-1">
                        {order.items?.map((item) => (
                            <li key={item.id} className="flex justify-between text-[#121417] dark:text-white py-1 border-b border-[#F0F2F5] dark:border-[#282C34]">
                                <span className="font-semibold">{item.drink_name}</span>
                                <span className="font-bold text-[#D73A49]">-{item.quantity} unit</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-[#F0F2F5] dark:border-[#282C34]">
                    <Button
                        variant="outline"
                        size="md"
                        onClick={onClose}
                        className="flex-1 dark:bg-[#1A1D24] dark:border-[#282C34] dark:text-white"
                    >
                        Kembali
                    </Button>
                    <Button
                        variant="orange"
                        size="md"
                        onClick={onConfirm}
                        disabled={processing}
                        className="flex-1 font-bold shadow-sm"
                    >
                        {processing ? 'Memproses...' : 'Ya, Konfirmasi & Potong'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
