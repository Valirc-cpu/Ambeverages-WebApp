import React from 'react';

export default function Button({
    type = 'button',
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    children,
    onClick,
    ...props
}) {
    const variants = {
        primary: 'bg-[#121417] hover:bg-[#2A2E35] text-white shadow-sm active:scale-[0.98]',
        orange: 'bg-[#FA4B00] hover:bg-[#E24200] text-white shadow-sm active:scale-[0.98]',
        whatsapp: 'bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-sm active:scale-[0.98]',
        outline: 'bg-white hover:bg-gray-50 text-[#121417] border border-[#DCE0E5] hover:border-[#121417] active:scale-[0.98]',
        secondary: 'bg-[#F2F4F7] hover:bg-[#E5E8EC] text-[#121417] active:scale-[0.98]',
        ghost: 'bg-transparent hover:bg-gray-100 text-[#6B7280] hover:text-[#121417]',
        danger: 'bg-[#D73A49] hover:bg-[#C22837] text-white shadow-sm active:scale-[0.98]',
        success: 'bg-[#1EBE5D] hover:bg-[#17A34E] text-white shadow-sm active:scale-[0.98]',
    };

    const sizes = {
        sm: 'px-4 py-1.5 text-xs rounded-full gap-1.5 font-semibold',
        md: 'px-5 py-2.5 text-sm rounded-full gap-2 font-bold',
        lg: 'px-7 py-3.5 text-base rounded-full gap-2.5 font-bold',
        icon: 'p-2.5 rounded-full',
    };

    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={`inline-flex items-center justify-center transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none select-none ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
