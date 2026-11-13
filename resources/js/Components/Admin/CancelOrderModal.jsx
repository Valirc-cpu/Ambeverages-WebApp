import React from 'react';
import Modal from '../Modal';
import Button from '../Button';

export default function CancelOrderModal({
    order,
    onClose,
    onConfirmCancel,
    processing = false,
}) {
    if (!order) return null;

    return (
        <Modal
            isOpen={!!order}
            onClose={onClose}
            title="Batalkan Pesanan"
            maxWidth="max-w-md"
        >
            <div className="space-y-4 py-2">
                <p className="text-xs text-[#4B5563]">
                    Apakah Anda yakin ingin membatalkan pesanan <span className="font-mono text-[#FA4B00] font-bold">{order.order_code}</span>?
                    {order.status === 'confirmed' && (
                        <span className="block mt-2 font-bold text-[#1EBE5D]">
                            (Stok minuman yang sebelumnya terpotong akan dikembalikan otomatis ke database).
                        </span>
                    )}
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-[#F0F2F5]">
                    <Button
                        variant="outline"
                        size="md"
                        onClick={onClose}
                        className="flex-1"
                    >
                        Tutup
                    </Button>
                    <Button
                        variant="danger"
                        size="md"
                        onClick={onConfirmCancel}
                        disabled={processing}
                        className="flex-1 font-bold"
                    >
                        {processing ? 'Membatalkan...' : 'Batalkan Pesanan'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
