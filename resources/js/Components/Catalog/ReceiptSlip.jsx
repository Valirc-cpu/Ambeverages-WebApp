import React from 'react';

export default function ReceiptSlip({
    orderCode = 'DRAFT-ORDER',
    customerName,
    customerPhone,
    items = [],
    totalPrice = 0,
    formattedTotal = '',
    notes,
}) {
    return (
        <div className="bg-[#FAFBFD] dark:bg-[#15171C] border border-[#DCE0E5] dark:border-[#2C313B] rounded-2xl p-5 text-[#121417] dark:text-[#F2F4F7] font-mono text-xs shadow-xs relative overflow-hidden transition-colors">
            {/* Header */}
            <div className="text-center pb-3 border-b border-dashed border-[#CBD2D9] dark:border-[#353B47] space-y-1">
                <div className="font-extrabold text-sm tracking-wider uppercase">AMBEVERAGES BAR</div>
                <div className="text-[10px] text-[#6B7280] dark:text-[#9CA3AF]">EST. 2026 • I AM BEVERAGES.</div>
                <div className="text-[11px] font-bold text-[#FA4B00] pt-1">#{orderCode}</div>
            </div>

            {/* Customer Details */}
            {(customerName || customerPhone) && (
                <div className="py-2.5 border-b border-dashed border-[#CBD2D9] dark:border-[#353B47] space-y-0.5 text-[11px]">
                    {customerName && (
                        <div className="flex justify-between">
                            <span className="text-[#6B7280] dark:text-[#9CA3AF]">PEMESAN:</span>
                            <span className="font-bold">{customerName}</span>
                        </div>
                    )}
                    {customerPhone && (
                        <div className="flex justify-between">
                            <span className="text-[#6B7280] dark:text-[#9CA3AF]">WHATSAPP:</span>
                            <span className="font-bold">{customerPhone}</span>
                        </div>
                    )}
                </div>
            )}

            {/* Line Items */}
            <div className="py-3 border-b border-dashed border-[#CBD2D9] dark:border-[#353B47] space-y-1.5">
                {items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start gap-2">
                        <div className="flex-1 truncate">
                            <span className="font-bold mr-1.5">{item.quantity}x</span>
                            <span>{item.name || item.drink_name}</span>
                        </div>
                        <span className="font-semibold shrink-0">
                            Rp {new Intl.NumberFormat('id-ID').format((item.price || 0) * (item.quantity || 1))}
                        </span>
                    </div>
                ))}
            </div>

            {/* Total */}
            <div className="pt-3 pb-2 flex justify-between items-center text-sm font-extrabold">
                <span>TOTAL BAYAR</span>
                <span className="text-base text-[#FA4B00]">
                    {formattedTotal || `Rp ${new Intl.NumberFormat('id-ID').format(totalPrice)}`}
                </span>
            </div>

            {notes && (
                <div className="pt-1 pb-2 text-[10px] text-[#6B7280] dark:text-[#9CA3AF] italic border-t border-dotted border-[#CBD2D9] dark:border-[#353B47]">
                    *Catatan: {notes}
                </div>
            )}

            {/* Faux Barcode strip */}
            <div className="pt-3 flex flex-col items-center justify-center opacity-70">
                <div className="h-6 w-4/5 flex justify-between items-center gap-[2px]">
                    {[4, 2, 6, 1, 3, 5, 2, 4, 1, 6, 2, 3, 5, 1, 4, 2, 6, 3, 1, 5, 2, 4, 3, 1, 6].map((w, i) => (
                        <div key={i} className="h-full bg-[#121417] dark:bg-white" style={{ width: `${w}px` }} />
                    ))}
                </div>
                <span className="text-[9px] tracking-widest text-[#6B7280] dark:text-[#9CA3AF] mt-1">{orderCode}</span>
            </div>
        </div>
    );
}
