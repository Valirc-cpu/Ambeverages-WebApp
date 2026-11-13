import React from 'react';

export default function Badge({ children, variant = 'neutral', size = 'sm', className = '' }) {
    const variants = {
        primary: 'bg-[#F6851B]/15 text-[#F6851B] border-[#F6851B]/30',
        success: 'bg-[#28A745]/15 text-[#48D168] border-[#28A745]/30',
        warning: 'bg-[#F0B034]/15 text-[#FFC453] border-[#F0B034]/30',
        danger: 'bg-[#D73A49]/15 text-[#FF6B7A] border-[#D73A49]/30',
        info: 'bg-[#037DD6]/15 text-[#42A5F5] border-[#037DD6]/30',
        neutral: 'bg-[#25282D] text-[#BBC0C5] border-[#3B4046]',
    };

    const sizes = {
        xs: 'px-2 py-0.5 text-[11px]',
        sm: 'px-2.5 py-1 text-xs',
        md: 'px-3 py-1.5 text-sm',
    };

    return (
        <span
            className={`inline-flex items-center font-medium rounded-full border tracking-wide transition-colors ${variants[variant] || variants.neutral} ${sizes[size] || sizes.sm} ${className}`}
        >
            {children}
        </span>
    );
}
