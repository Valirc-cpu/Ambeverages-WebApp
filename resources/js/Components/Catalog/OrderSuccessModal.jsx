import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import Modal from '../Modal';
import Button from '../Button';
import { ExternalLink, CheckCircle } from 'lucide-react';

export default function OrderSuccessModal({ order, onClose }) {
    useEffect(() => {
        if (order) {
            // Trigger creative celebration confetti
            confetti({
                particleCount: 65,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#FA4B00', '#B9F24B', '#121417', '#E2761B'],
            });
        }
    }, [order]);

    if (!order) return null;

    return (
        <Modal
            isOpen={!!order}
            onClose={onClose}
            title="Pesanan Berhasil Disiapkan"
            maxWidth="max-w-md"
        >
            <div className="text-center py-2 space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#121417] dark:bg-[#1E222A] text-[#B9F24B] flex items-center justify-center mx-auto shadow-md border border-transparent dark:border-[#353B47]">
                    <CheckCircle className="w-7 h-7" />
                </div>

                <div>
                    <h3 className="text-xl font-extrabold text-[#121417] dark:text-white">Kirim ke WhatsApp</h3>
                    <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-1 font-medium">
                        Tiket pesanan Anda telah tersimpan dengan status <span className="font-bold text-[#FA4B00]">Menunggu Konfirmasi</span>.
                    </p>
                </div>

                {/* Receipt Card */}
                <div className="p-4 rounded-2xl bg-[#F7F8FA] dark:bg-[#181A20] border border-[#E5E8EC] dark:border-[#282C34] text-left space-y-2 text-xs font-mono">
                    <div className="flex justify-between">
                        <span className="text-[#6B7280] dark:text-[#9CA3AF]">KODE ORDER:</span>
                        <span className="font-extrabold text-[#FA4B00]">{order.order_code}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-[#6B7280] dark:text-[#9CA3AF]">PEMESAN:</span>
                        <span className="font-bold text-[#121417] dark:text-white">{order.customer_name}</span>
                    </div>
                    {order.admin_phone && (
                        <div className="flex justify-between">
                            <span className="text-[#6B7280] dark:text-[#9CA3AF]">WA TUJUAN (.env):</span>
                            <span className="font-bold text-[#25D366]">+{order.admin_phone}</span>
                        </div>
                    )}
                    <div className="flex justify-between border-t border-[#E5E8EC] dark:border-[#282C34] pt-2 text-sm font-sans font-bold text-[#121417] dark:text-white">
                        <span>TOTAL BAYAR:</span>
                        <span className="text-[#FA4B00] font-extrabold">{order.total_price}</span>
                    </div>
                </div>

                <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">
                    Klik tombol di bawah ini untuk mengirim pesan pesanan langsung ke WhatsApp admin.
                </p>

                <div className="space-y-2 pt-2">
                    <a
                        href={order.whatsapp_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white font-extrabold text-sm shadow-[0_4px_16px_rgba(37,211,102,0.3)] transition-all hover:scale-[1.01] active:scale-[0.99]"
                    >
                        <ExternalLink className="w-4 h-4" />
                        <span>Kirim Rincian ke WhatsApp Admin</span>
                    </a>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="w-full text-xs text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#121417] dark:hover:text-white"
                    >
                        Tutup Jendela Ini
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
