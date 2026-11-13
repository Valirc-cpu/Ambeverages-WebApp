import React from 'react';

export default function Badge({ children, variant = 'neutral', size = 'sm', className = '' }) {
    const variants = {
        primary: 'bg-[#FFF3EB] text-[#FA4B00] border border-[#FA4B00]/25 font-bold',
        success: 'bg-[#B9F24B] text-[#121417] border border-[#A5DD3C] font-bold shadow-sm',
        warning: 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] font-bold',
        danger: 'bg-[#FEE2E2] text-[#B91C1C] border border-[#FECACA] font-bold',
        info: 'bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD] font-bold',
        neutral: 'bg-[#F2F4F7] text-[#374151] border border-[#E5E8EC] font-semibold',
        dark: 'bg-[#121417] text-white font-semibold',
    };

    const sizes = {
        xs: 'px-2.5 py-0.5 text-[11px]',
        sm: 'px-3 py-1 text-xs',
        md: 'px-3.5 py-1.5 text-sm',
    };

    return (
        <span
            className={`inline-flex items-center rounded-full tracking-tight transition-colors ${variants[variant] || variants.neutral} ${sizes[size] || sizes.sm} ${className}`}
        >
            {children}
        </span>
    );
}
