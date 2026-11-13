import React from 'react';
import Modal from '../Modal';
import Button from '../Button';
import { Check, ExternalLink } from 'lucide-react';

export default function OrderSuccessModal({ order, onClose }) {
    if (!order) return null;

    return (
        <Modal
            isOpen={!!order}
            onClose={onClose}
            title="Pesanan Berhasil Dibuat!"
            maxWidth="max-w-md"
        >
            <div className="text-center py-4 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#B9F24B] border border-[#A5DD3C] text-[#121417] flex items-center justify-center mx-auto shadow-md">
                    <Check className="w-8 h-8 stroke-[3]" />
                </div>

                <div>
                    <h3 className="text-xl font-extrabold text-[#121417]">Siap Terhubung ke WhatsApp</h3>
                    <p className="text-xs text-[#6B7280] mt-1 font-medium">
                        Kode pesanan Anda telah dibuat dengan status <span className="font-bold text-[#FA4B00]">Menunggu Konfirmasi</span>.
                    </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F7F8FA] border border-[#E5E8EC] text-left space-y-2 text-xs">
                    <div className="flex justify-between">
                        <span className="text-[#6B7280] font-medium">Kode Order:</span>
                        <span className="font-mono font-bold text-[#FA4B00]">{order.order_code}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-[#6B7280] font-medium">Nama Pemesan:</span>
                        <span className="font-bold text-[#121417]">{order.customer_name}</span>
                    </div>
                    <div className="flex justify-between border-t border-[#E5E8EC] pt-2 text-sm">
                        <span className="font-bold text-[#121417]">Total Pembayaran:</span>
                        <span className="font-extrabold text-[#FA4B00]">{order.total_price}</span>
                    </div>
                </div>

                <p className="text-xs text-[#6B7280] leading-relaxed">
                    Klik tombol di bawah ini untuk membuka WhatsApp dan mengirim rincian order ke admin toko.
                </p>

                <div className="space-y-2 pt-2">
                    <a
                        href={order.whatsapp_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white font-extrabold text-sm shadow-[0_6px_20px_rgba(37,211,102,0.35)] transition-all hover:scale-[1.01] active:scale-[0.99]"
                    >
                        <ExternalLink className="w-4 h-4" />
                        <span>Buka Chat WhatsApp Admin</span>
                    </a>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="w-full text-xs text-[#6B7280] hover:text-[#121417]"
                    >
                        Tutup Jendela Ini
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
