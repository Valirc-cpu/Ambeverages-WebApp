import React from 'react';
import Badge from '../Badge';
import Button from '../Button';
import { MessageSquare, ExternalLink, Check, X, CheckCircle2, XCircle, User } from 'lucide-react';

export default function OrderRowCard({
    order,
    onOpenConfirm,
    onOpenCancel,
}) {
    const isPending = order.status === 'pending';
    const isConfirmed = order.status === 'confirmed';
    const isCancelled = order.status === 'cancelled';

    // Clean phone for whatsapp
    const cleanPhone = (order.customer_phone || '').replace(/[^0-9]/g, '');
    const waPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.substring(1) : cleanPhone;

    return (
        <div className="p-6 bg-white dark:bg-[#15171C] border border-[#E5E8EC] dark:border-[#262A32] rounded-[28px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-colors">
            {/* Order Info */}
            <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-sm font-extrabold text-[#FA4B00]">
                        {order.order_code}
                    </span>
                    <span className="text-xs text-[#9CA3AF] font-medium">
                        {new Date(order.created_at).toLocaleString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </span>
                    <div>
                        {isPending && <Badge variant="warning">Menunggu Konfirmasi</Badge>}
                        {isConfirmed && <Badge variant="success">Dikonfirmasi (Stok Terpotong)</Badge>}
                        {isCancelled && <Badge variant="danger">Dibatalkan</Badge>}
                    </div>
                </div>

                {/* Customer Info */}
                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-[#4B5563] dark:text-[#9CA3AF]">
                    <span className="font-bold text-[#121417] dark:text-white flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#6B7280] dark:text-[#9CA3AF]" />
                        <span>{order.customer_name}</span>
                    </span>
                    <a
                        href={`https://wa.me/${waPhone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#25D366] hover:underline flex items-center gap-1 font-bold"
                    >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{order.customer_phone}</span>
                        <ExternalLink className="w-3 h-3" />
                    </a>
                    {order.notes && (
                        <span className="text-[#6B7280] dark:text-[#9CA3AF] italic">
                            Catatan: "{order.notes}"
                        </span>
                    )}
                </div>

                {/* Items Ordered */}
                <div className="p-3.5 rounded-2xl bg-[#F7F8FA] dark:bg-[#1A1D24] border border-[#E5E8EC] dark:border-[#292D36] text-xs">
                    <span className="text-[10px] uppercase font-bold text-[#9CA3AF] block mb-1.5 tracking-wider">
                        Minuman yang Dipesan:
                    </span>
                    <div className="flex flex-wrap gap-2">
                        {order.items?.map((item) => (
                            <span
                                key={item.id}
                                className="px-3 py-1 rounded-full bg-white dark:bg-[#14161B] border border-[#DCE0E5] dark:border-[#2C313B] text-[#121417] dark:text-white flex items-center gap-1.5 shadow-xs"
                            >
                                <span className="text-[#FA4B00] font-extrabold">{item.quantity}x</span>
                                <span className="font-semibold">{item.drink_name}</span>
                                <span className="text-[#6B7280] dark:text-[#9CA3AF]">({item.formatted_subtotal})</span>
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Price and Actions */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 shrink-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-[#F0F2F5] dark:border-[#24272D]">
                <div className="text-left sm:text-right">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#9CA3AF] block">
                        Total Pembayaran
                    </span>
                    <span className="text-2xl font-extrabold text-[#121417] dark:text-white">
                        {order.formatted_total_price}
                    </span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                    {isPending && (
                        <>
                            <Button
                                variant="orange"
                                size="sm"
                                onClick={() => onOpenConfirm(order)}
                                className="font-bold shadow-sm"
                            >
                                <Check className="w-4 h-4 stroke-[3]" />
                                <span>Konfirmasi Pesanan</span>
                            </Button>

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onOpenCancel(order)}
                                className="text-xs text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#D73A49]"
                            >
                                <X className="w-4 h-4" />
                                <span>Batal</span>
                            </Button>
                        </>
                    )}

                    {isConfirmed && (
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-[#1EBE5D] flex items-center gap-1 font-bold">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Stok Terpotong Otomatis</span>
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onOpenCancel(order)}
                                title="Batalkan dan pulihkan stok"
                                className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#D73A49]"
                            >
                                Batal
                            </Button>
                        </div>
                    )}

                    {isCancelled && (
                        <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF] flex items-center gap-1 font-semibold">
                            <XCircle className="w-4 h-4 text-[#D73A49]" />
                            <span>Pesanan Dibatalkan</span>
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
