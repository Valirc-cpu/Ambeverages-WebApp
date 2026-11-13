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
                <div className="p-4 rounded-2xl bg-[#FFF3EB] border border-[#FA4B00]/25 text-xs text-[#4B5563] flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-[#FA4B00] shrink-0 mt-0.5" />
                    <div>
                        <span className="font-extrabold text-[#121417] block mb-0.5">Konfirmasi Pesanan</span>
                        Mengonfirmasi pesanan ini akan <strong>otomatis mengurangi stok fisik</strong> masing-masing minuman di database secara realtime.
                    </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#F7F8FA] border border-[#E5E8EC] space-y-1.5 text-xs">
                    <div className="flex justify-between">
                        <span className="text-[#6B7280]">Kode Pesanan:</span>
                        <span className="font-mono font-extrabold text-[#121417]">{order.order_code}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-[#6B7280]">Nama Pemesan:</span>
                        <span className="font-bold text-[#121417]">{order.customer_name}</span>
                    </div>
                    <div className="flex justify-between border-t border-[#E5E8EC] pt-1.5">
                        <span className="text-[#6B7280]">Total Pembayaran:</span>
                        <span className="font-extrabold text-[#FA4B00] text-sm">{order.formatted_total_price}</span>
                    </div>
                </div>

                <div className="space-y-1 text-xs">
                    <span className="text-[#6B7280] font-bold block">Daftar item yang stoknya akan dipotong:</span>
                    <ul className="space-y-1">
                        {order.items?.map((item) => (
                            <li key={item.id} className="flex justify-between text-[#121417] py-1 border-b border-[#F0F2F5]">
                                <span className="font-semibold">{item.drink_name}</span>
                                <span className="font-bold text-[#D73A49]">-{item.quantity} unit</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-[#F0F2F5]">
                    <Button
                        variant="outline"
                        size="md"
                        onClick={onClose}
                        className="flex-1"
                    >
                        Kembali
                    </Button>
                    <Button
                        variant="orange"
                        size="md"
                        onClick={onConfirm}
                        disabled={processing}
                        className="flex-1 font-bold shadow-[0_4px_16px_rgba(250,75,0,0.3)]"
                    >
                        {processing ? 'Memproses...' : 'Ya, Konfirmasi & Potong'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
